defmodule Portboy.Worker do
  use GenServer

  # Client

  def start_link(opts = [command: _command]) do
    name = Keyword.fetch(opts, :name)
    link_opts = if name, do: [name: name], else: []
    GenServer.start_link(__MODULE__, opts, link_opts)
  end

  def call(server, function, arguments) do
    result = GenServer.call(server, {:call, encode_input(function, arguments)})
    case result do
      {:ok, {:error, reason}} -> {:error, reason}
      {:ok, {:ok, value}} -> {:ok, value}
      r -> r
    end
  end

  defp encode_input(function, arguments) do
    Jason.encode!(%{name: function, arguments: arguments})
  end

  def kill(server) do
    Process.send(server, :kill, [])
  end

  # Server

  def init(opts) do
    command = Keyword.fetch!(opts, :command)

    state = %{
      command: command,
      port: nil,
      from: nil,
      exit_status: nil
    }

    {:ok, state, {:continue, :init}}
  end

  def handle_continue(:init, state) do
    {command, args} = Map.fetch!(state, :command)
    port = Port.open({:spawn_executable, command}, [:binary, :exit_status, args: args])
    state = Map.put(state, :port, port)

    {:noreply, state}
  end

  def handle_call({:call, input}, from, state = %{port: port}) do
    send(port, {self(), {:command, input}})

    {:noreply, %{state | from: from}}
  end

  def handle_info({_port, {:data, raw_data}}, state = %{from: from}) do
    data = Jason.decode!(raw_data)

    response =
      case data do
        %{"ok" => value} -> {:ok, value}
        %{"error" => reason} -> {:error, reason}
        _ -> {:error, :invalid}
      end

    GenServer.reply(from, response)

    {:noreply, %{state | from: nil}}
  end

  def handle_info({_port, {:exit_status, status}}, state) do
    {:noreply, %{state | exit_status: status}}
  end

  def handle_info(:kill, state) do
    Port.close(state.port)
    {:stop, :normal, %{state | port: nil, from: nil, exit_status: nil}}
  end

  def handle_info(_msg, state), do: {:noreply, state}
end
