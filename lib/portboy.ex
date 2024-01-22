defmodule Portboy do
  alias Portboy.Worker

  def child(name, command), do: {Worker, name: name, command: command}

  def child_pool(name, command, size, overflow) do
    config = [
      name: {:local, name},
      worker_module: {Worker, command},
      size: size,
      max_overflow: overflow
    ]

    :poolboy.child_spec(:worker, config)
  end

  def run(server, function, arguments) do
    Worker.call(server, function, arguments)
  end

  def run_pool(name, function, arguments) do
    Task.async(fn ->
      :poolboy.transaction(name, fn pid ->
        Worker.call(pid, function, arguments)
      end)
    end)
    |> Task.await()
  end

  def run_exit(command, function, arguments) do
    {:ok, server} = Worker.start_link(command: command)
    result = Worker.call(server, function, arguments)
    Worker.kill(server)

    result
  end
end
