# ConsoleStyle

This is a ConsoleStyle library for JS++ for formatting text in *nix terminals.

## Prerequisites

* JS++
* A terminal emulator that supports ANSI escape codes.

## Getting Started

Download the library and run the preview file:

    $ make preview

Basic usage is shown in `preview.jspp`:

    import Vendor.Onux.ConsoleStyle.Colors;
    
    external console;
    
    console.log(Colors.green("green"));

Make sure you link the library during compilation:

    $ js++ myapp.jspp /path/to/ConsoleStyle/src/

You need to provide the `src` directory in particular. The root directory will result in compiler errors because the JS++ compiler will try and link the tests, preview file, etc.

## License

MIT License