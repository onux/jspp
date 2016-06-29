" Vim syntax file
" Language:     JSPP
" Maintainer:   
" Last Change:  
" Version:      0.1.0
" Changes:      Initial version  
"

if !exists("main_syntax")
  if version < 600
    syntax clear
  elseif exists("b:current_syntax")
    finish
  endif
  let main_syntax = 'jspp'
endif

"" Drop fold if it set but VIM doesn't support it.
let b:jspp_fold='true'
if version < 600    " Don't support the old version
  unlet! b:jspp_fold
endif

"" dollar sigh is permittd anywhere in an identifier
setlocal iskeyword+=$

syntax sync fromstart

"" JavaScript comments
syntax keyword jsppCommentTodo    TODO FIXME XXX TBD contained
syntax region  jsppLineComment    start=+\/\/+ end=+$+ keepend contains=jsppCommentTodo,@Spell
syntax region  jsppLineComment    start=+^\s*\/\/+ skip=+\n\s*\/\/+ end=+$+ keepend contains=jsppCommentTodo,@Spell fold
syntax region  jsppDocMacro       start="{{" end="}}" oneline contained
syntax match   jsppDocTag         "@\s*\w\+" contained
syntax region  jsppComment        start="/\*"  end="\*/" contains=jsppCommentTodo,jsppDocMacro,jsppDocTag,@Spell fold

syntax case match

"" Syntax in the JavaScript code
syntax match   jsppSpecial        "\\\d\d\d\|\\x\x\{2\}\|\\u\x\{4\}\|\\."
syntax region  jsppStringD        start=+"+  skip=+\\\\\|\\$"+  end=+"+  contains=jsppSpecial,@htmlPreproc
syntax region  jsppStringS        start=+'+  skip=+\\\\\|\\$'+  end=+'+  contains=jsppSpecial,@htmlPreproc  
syntax region  jsppCharacter      start=+`+  skip=+\\`+  end=+`+ oneline 
syntax region  jsppRegexpString   start=+/[^/*]+me=e-1 skip=+\\\\\|\\/+ end=+/[gim]\{0,3\}\s*$+ end=+/[gim]\{0,3\}\s*[;.,)\]}]+me=e-1 contains=jsppSpecial,@htmlPreproc oneline

syntax match   jsppNumber         /\<\d\+U\=L\=\>\|\<0[xX]\x\+\>/
syntax match   jsppFloat          /\<\%(\d\+\.\d\+\|\d\+\.\|\.\d\+\|\d\+\)\%([eE][+-]\=\d\+\)\=\>/
syntax match   jsppFloat2         /\<\%(\d\+\.\d\+\|\d\+\.\|\.\d\+\|\d\+\)[dDfF]\>/

"" Programm Keywords
syntax keyword jsppSource         import export implicit explicit
syntax keyword jsppType           const var void bool int short byte long char float double string signed unsigned optional 
syntax keyword jsppOperator       delete new in instanceof let typeof typeid
syntax keyword jsppBoolean        true false
syntax keyword jsppNull           null undefined

"" Statement Keywords
syntax keyword jsppConditional    if else
syntax keyword jsppRepeat         do while for foreach
syntax keyword jsppBranch         break continue switch case default return
syntax keyword jsppStatement      try catch throw with finally

syntax keyword jsppFutureKeys     abstract enum interface static extends yield super this final class throws private debugger protected public external module inline property virtual override 

"" Code blocks
syntax cluster jsppAll       contains=jsppComment,jsppLineComment,jsppStringD,jsppStringS,jsppCharacter,jsppRegexpString,jsppNumber,jsppFloat,jsppFloat2,jsppSource,jsppType,jsppOperator,jsppBoolean,jsppNull,jsppFunction,jsppConditional,jsppRepeat,jsppBranch,jsppStatement,jsppFutureKeys
syntax region  jsppBracket   matchgroup=jsppBracket transparent start="\[" end="\]" contains=@jsppAll,jsppBracket,jsppParen,jsppBlock,@htmlPreproc
syntax region  jsppParen     matchgroup=jsppParen   transparent start="("  end=")"  contains=@jsppAll,jsppParen,jsppBracket,jsppBlock,@htmlPreproc
syntax region  jsppBlock     matchgroup=jsppBlock   transparent start="{"  end="}"  contains=@jsppAll,jsppParen,jsppBracket,jsppBlock,@htmlPreproc 

if main_syntax == "jspp"
  syntax sync clear
  syntax sync ccomment jsppComment minlines=200
  syntax sync match jsppHighlight grouphere jsppBlock /{/
endif

"" Fold control
if exists("b:jspp_fold")
    syntax match   jsppFunction       /\<function\>/ nextgroup=jsppFuncName skipwhite
    syntax match   jsppOpAssign       /=\@<!=/ nextgroup=jsppFuncBlock skipwhite skipempty
    syntax region  jsppFuncName       contained matchgroup=jsppFuncName start=/\%(\$\|\w\)*\s*(/ end=/)/ contains=jsppLineComment,jsppComment nextgroup=jsppFuncBlock skipwhite skipempty
    syntax region  jsppFuncBlock      contained matchgroup=jsppFuncBlock start="{" end="}" contains=@jsppAll,jsppParen,jsppBracket,jsppBlock fold

    if &l:filetype=='jspp' && !&diff
      " Fold setting
      " Redefine the foldtext (to show a JS function outline) and foldlevel
      setlocal foldmethod=syntax
      setlocal foldlevel=4
    endif
else
    syntax keyword jsppFunction       function
    setlocal foldmethod<
    setlocal foldlevel<
endif

" Define the default highlighting.
" For version 5.7 and earlier: only when not done already
" For version 5.8 and later: only when an item doesn't have highlighting yet
if version >= 508 || !exists("did_jspp_syn_inits")
  if version < 508
    let did_jspp_syn_inits = 1
    command -nargs=+ HiLink hi link <args>
  else
    command -nargs=+ HiLink hi def link <args>
  endif
  HiLink jsppComment              Comment
  HiLink jsppLineComment          Comment
  HiLink jsppCommentTodo          Todo
  HiLink jsppDocMacro             Todo
  HiLink jsppDocTag               Todo
  HiLink jsppStringS              String
  HiLink jsppStringD              String
  HiLink jsppCharacter            String
  HiLink jsppRegexpString         String
  HiLink jsppCharacter            Character
  HiLink jsppConditional          Conditional
  HiLink jsppBranch               Conditional
  HiLink jsppRepeat               Repeat
  HiLink jsppStatement            Statement
  HiLink jsppFunction             Type
  HiLink jsppOperator             Operator
  HiLink jsppType                 Type
  HiLink jsppNull                 Type
  HiLink jsppNumber               Number
  HiLink jsppFloat                Number
  HiLink jsppFloat2               Number
  HiLink jsppBoolean              Boolean
  HiLink jsppSpecial              Special
  HiLink jsppSource               Special
  HiLink jsppFutureKeys           Keyword 

  delcommand HiLink
endif

let b:current_syntax = "jspp"
if main_syntax == 'jspp'
  unlet main_syntax
endif

" vim: ts=4

