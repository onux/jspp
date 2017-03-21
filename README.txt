JavaScript++ Alpha 0.011
-----------------------

JavaScript++ provides the same familiar C-style language syntax of JavaScript and brings modern language features such as classes; block scoping and constants; pluggable type systems and type safety; packages and modules; comprehensive standard libraries; enhanced regular expressions and PCRE; and more to JavaScript with almost no learning curve through an extended ES3 grammar.

As JavaScript grows and extends its reach beyond the web browser, and larger applications with increasing complexity begin to pop up, the original JavaScript syntax - which was designed for adding small programs and interactivity to web pages - needs to be extended to facilitate development of increasingly complex web applications. With features such as classes, static typing, and a package/module system, JavaScript++ enables large-scale software development that is maintainable, reliable, and economical.

JavaScript++ compiles to ES3-compatible JavaScript and is compatible with IE 5.5 and all versions of Firefox, Chrome, and the vast majority of web browsers dating back to 1999 for the client-side and Node.js, v8, SpiderMonkey, and Rhino on the server-side. Furthermore, JavaScript++ is backwards-compatible with all existing JavaScript code and libraries (jQuery, YUI et al), and JavaScript++ code can seamlessly and easily be embedded into your existing JavaScript code.

The JavaScript++ compiler supports regular JavaScript so there is practically no learning curve. Just pick and choose which JavaScript++ features you want to incorporate and learn on demand.

JavaScript++ incorporates features from Python, Perl, Java/C#, ES4, Harmony, Haskell, and more while incorporating its own unique features. The driving philosophy behind JavaScript++ is productivity, and it will make everything from small scripts to large applications easier and faster to write. Take the mundane out of your JavaScript code and enjoy the good parts of JavaScript with JavaScript++!

-----------------------

This is an early alpha preview version.

Official website: http://jspp.javascript.am/

Tutorial: http://jspp.javascript.am/tutorial.html

Installation & Usage
---------------------
Getting up and running is quick and simple:

1. Open compiler.html in your favorite web browser.

2. Type into the HTML textbox:

let foo = "Hello World";
alert(foo);

3. Click "Compile"

4. Click "Execute" to run the compiled code.

5. Copy the compiled code to a .js file and execute it in your browser or server.

6. Open your browser's console to view the warnings and errors produced by the compiler.

A command-line compiler is not available for the current alpha.

A command-line REPL is not available for the current alpha.

You can join us on IRC at #javascript++ on freenode and use jsppBot as a sort of REPL.

File Descriptions
-----------------
jsdefs.js - Lookup tables
jsparse.js - Lexer/parser
compiler.js - Code generator
typed-es3.js - Emulation of typed ES3 environment.

lib/ - Standard Library
lib/dom - DOM libraries
lib/jspp - JavaScript++ libraries.  Language only; does not manipulate or depend on host objects
lib/jspp/lang/es5.js - Incorporates ES5 features such as array extras and Function.prototype.bind
lib/jspp/lang/json2.js - JSON library
lib/server - Server-side JavaScript libraries

typesys/ - Pluggable type systems
typesys/strict.js - Strong, static typing for JavaScript++

test/ - Unit tests
test/qunit.js - QUnit JS file
test/qunit.css - QUnit CSS file
test/classes.html - Unit tests for classes
test/scopes.html - Unit tests for scopes
test/typesys-strict.html - Unit tests for #typesys strict

Credits
-------
Brendan Eich - JavaScript & Narcissus
Guillaume Lathoud - v8/JSC port of Narcissus
Roger Poon - JavaScript++ Language
QUnit - QUnit testing framework
