# JS++ Emacs Integration

## Installation
1. Open your Emacs [initialization file](https://www.gnu.org/software/emacs/manual/html_node/emacs/Init-File.html) (usually located at `~/.emacs`)
2. Add the following code to your Emacs initialization file:

    ```
    ;; Custom Settings
    ;; ===============
    ;; To avoid any trouble with the customization system of GNU emacs
    ;; we set the default file ~/.gnu-emacs-custom
    (setq custom-file "~/.gnu-emacs-custom")
    (load "~/.gnu-emacs-custom" t t)
    ```
3. Create the file `~/.gnu-emacs-custom` if it doesn't already exist. Open the file and add the following code:

    ```
    ;;
    ;; Load jspp file
    ;; ----------------
    (setq mylsl-mode "~/.emacs.d/lisp/jspp-mode.el")
    (load "~/.emacs.d/lisp/jspp-mode.el" t t)
    (custom-set-variables
     ;; custom-set-variables was added by Custom.
     ;; If you edit it by hand, you could mess it up, so be careful.
     ;; Your init file should contain only one such instance.
     ;; If there is more than one, they won't work right.
     '(ansi-color-faces-vector
      [default default default italic underline success warning error])
     '(custom-enabled-themes (quote (misterioso))))'
    (custom-set-faces
     ;; custom-set-faces was added by Custom.
     ;; If you edit it by hand, you could mess it up, so be careful.
     ;; Your init file should contain only one such instance.
     ;; If there is more than one, they won't work right.
     )
    ```
4. Create the directory `~/.emacs.d/lisp/` if it does not already exist. Copy the `jspp-mode.el` file to the directory.
5. Done!
