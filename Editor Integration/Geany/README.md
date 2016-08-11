# JS++ Geany Integration

This plugin provides syntax highlighting and compiler integration for the Geany
editor.

## Installation

1. Copy `filetypes.jspp.conf` to `/usr/share/geany`
2. Open `/usr/share/geany/filetype_extensions.conf` and make the following
edits:

    Under `[Extensions]`, add the following line:

    ```
    JS++=*.jspp;*.jpp;
    ```

    Under `[Groups]`, add `JS++` (separated by semicolons) to the `Programming=`
list.
3. Restart Geany.
