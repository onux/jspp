vim Syntax Highlighting for JS++
---

Installation
-
1. Navigate to your vim plugin path. Depending on your version, the plugin path is usually located at /usr/share/vim/vimXX (where XX is the vim version number)
2. Open filetype.vim
3. Search for the JavaScript definitions, the line should look like:

    ```
    " JavaScript, ECMAScript
    au BufNewFile,BufRead *.js,*.javascript,*.es,*.jsx   setf javascript
    ```
4. Beneath that line, add:

    ```
    " JS++
    au BufNewFile,BufRead *.jpp,*.jspp              setf jspp
    ```
5. In the vim plugin path, there should be a `syntax` folder. Copy the jspp.vim file into the `syntax` folder.

You're done! Now all JS++ files should benefit from syntax highlighting in vim.
