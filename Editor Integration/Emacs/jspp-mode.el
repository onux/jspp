;; Copyright (c) 2016 Jonathon Murphy
;; 
;; Permission is hereby granted, free of charge, to any person obtaining a copy
;; of this software and associated documentation files (the "Software"), to deal
;; in the Software without restriction, including without limitation the rights
;; to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
;; copies of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:
;; 
;; The above copyright notice and this permission notice shall be included in
;; all copies or substantial portions of the Software.
;; 
;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
;; AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
;; OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
;; THE SOFTWARE.
;; 

;;; Code:
(defvar jspp-mode-hook nil)

(defvar jspp-mode-map
  (let ((jspp-mode-map (make-keymap)))
    (define-key jspp-mode-map "\C-j" 'newline-and-indent)
    jspp-mode-map)
  "Keymap for JSPP major mode")

;; The following line adds the .jspp extention for this mode.
;; emacs will now autoload this mode when a .jspp file is opened.
(add-to-list 'auto-mode-alist '("\\.jspp\\'" . jspp-mode))

;; Define language syntax in necessary groups.
(setq js-keywords '("if" "in" "do" "for" "new" "try" "this" "else" "case" "with" "while" "break" "catch" "throw" "return" "typeof" "delete" "switch" "default" "finally" "continue" "debugger" "instanceof" "true" "false" "null"))
(setq jspp-keywords '("import" "external" "module" "foreach" "typeid" "enum" "interface" "class" "super" "implicit" "explicit" "undefined"))
(setq jspp-types '("var" "function" "bool" "string" "byte" "short" "int" "long" "float" "double" "char" "void" "signed" "unsigned"))
(setq jspp-modifier-keywords '("private" "protected" "public" "static" "final" "inline" "property" "abstract" "optional" "virtual" "override"))
(setq jspp-operators '(";" "[" "]" "(" ")" "." "," ":" "===" "==" "=" "!==" "!=" "!" "<<=" "<<" "<=" "<" ">>>=" ">>>" ">>=" ">>" ">=" ">" "+=" "++" "+" "-=" "--" "-" "*=" "*" "/=" "/" "%=" "%" "&&=" "&&" "&=" "&" "||=" "||" "|=" "|" "^=" "^" "~" "?="))
(setq jspp-warning-keywords '("let" "const" "yield" "export" "extends" "implements" "package"))

;; Obtain regex for each of the defined groups.
(setq js-keywords-regexp (regexp-opt js-keywords 'words))
(setq jspp-keywords-regexp (regexp-opt jspp-keywords 'words))
(setq jspp-types-regexp (regexp-opt jspp-types 'words))
(setq jspp-modifier-keywords-regexp (regexp-opt jspp-modifier-keywords 'words))
(setq jspp-operators-regexp (regexp-opt jspp-operators 'words))
(setq jspp-warning-keywords-regexp (regexp-opt jspp-warning-keywords 'words))

;; Assign colors to each symbol type.
(set-face-foreground 'font-lock-type-face "blue")
(set-face-foreground 'font-lock-keyword-face "purple")
(set-face-foreground 'font-lock-comment-face "red")
(set-face-foreground 'font-lock-string-face "dark green")
(set-face-foreground 'font-lock-doc-face "dark red")
(set-face-foreground 'font-lock-constant-face "dark green")
(set-face-foreground 'font-lock-warning-face "white")
(set-face-background 'font-lock-warning-face "red")

;; Define extended behavior for comments, and string literals.
(defvar jspp-mode-syntax-table
  (let ((jspp-mode-syntax-table (make-syntax-table)))
	
    ; This is added so entity names with underscores can be more easily parsed
	(modify-syntax-entry ?_ "w" jspp-mode-syntax-table)
	
	; Comment styles are same as C++
	(modify-syntax-entry ?/ ". 124b" jspp-mode-syntax-table)
	(modify-syntax-entry ?* ". 23" jspp-mode-syntax-table)
	(modify-syntax-entry ?\n "> b" jspp-mode-syntax-table)
   
	;; String literals
   (modify-syntax-entry ?\' "\"'"  jspp-mode-syntax-table)
   (modify-syntax-entry ?\" "\"\"" jspp-mode-syntax-table)
   (modify-syntax-entry ?\` "\"`"  jspp-mode-syntax-table)
   
   ;; Escape character
   (modify-syntax-entry ?\\ "\\" jspp-mode-syntax-table)
	jspp-mode-syntax-table)
  "Syntax table for jspp-mode")

;; Use regex to apply the color scheme to the symbols.
(setq jspp-font-lock-keywords 
   `(
   (,jspp-keywords-regexp . font-lock-keyword-face)
   (,jspp-types-regexp . font-lock-type-face)
   (,jspp-modifier-keywords-regexp . font-lock-keyword-face)
   (,js-keywords-regexp . font-lock-keyword-face)
   (,jspp-warning-keywords-regexp . font-lock-warning-face)
   (,"\@[:alpha:]+" . font-lock-doc-face)
   (,"{{[:alpha:]+\}\}" . font-lock-doc-face)
   ))
  
(defun jspp-mode ()
  (interactive)
  (kill-all-local-variables)
  (use-local-map jspp-mode-map)
  (set-syntax-table jspp-mode-syntax-table)
  ;; Set up font-lock
  (setq font-lock-defaults '((jspp-font-lock-keywords)))
  ;; Register our indentation function(Currently not working)
  ;;(set (make-local-variable 'indent-line-function) 'jspp-indent-line)  
  (setq major-mode 'jspp-mode)
  (setq mode-name "JSPP")
  (run-hooks 'jspp-mode-hook))
;; Source the mode for emacs access
(provide 'jspp-mode)

;;; jspp-mode.el ends here
