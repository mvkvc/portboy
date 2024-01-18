# portboy

Easily call code from other languages in Elixir.

To try it out open a REPL in the project root with `iex -S mix` and run `Portboy.run_exit({"/usr/bin/js", ["./clients/js/out/example.js"]}, "add", %{x: 1, y: 2})` (substituting the path to your installation of NodeJS as needed).

## Languages

- [X] JS
- [ ] Python
- [ ] Ruby
- [ ] Julia

## Installation

```elixir
def deps do
  [
    {:portboy, :git, "https://github.com/mvkvc/portboy.git"}
  ]
end
```
