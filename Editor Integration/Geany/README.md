# JS++ Geany Integration

This plugin provides syntax highlighting and compiler integration for the Geany
editor.

## Installation

1. Copy `filetypes.JS++.conf` to `/usr/share/geany`
2. Open `/usr/share/geany/filetype_extensions.conf` and make the following
edits:

    Under `[Extensions]`, add the following line:

    ```
    JS++=*.jspp;*.jpp;*.js++;
    ```

    Under `[Groups]`, add `JS++` (separated by semicolons) to the `Programming=`
list.
3. Restart Geany.

## Troubleshooting

If files ending in `.jspp`,`.jpp`, or `.js++` are not automatically being 
highlighted as JS++ files, ensure the following is correct:

`filetypes.<THIS>.conf`

In the above filename `<THIS>` is case-sensitive in Geany. `<THIS>` must match
exactly (including case) the text that appears in your
`/usr/share/geany/filetype_extensions.conf` file.

Therefore, if you named the file `filetypes.Js++.conf` and you added
`JS++=*.jspp;*.jpp;*.js++;` to `filetype_extensison.conf`, the filename and
configuration names do not match exactly, and Geany will fail to automatically
load the JS++ plugin.
