// Cross-engine port of the SpiderMonkey Narcissus parser.
//  * Original: http://mxr.mozilla.org/mozilla/source/js/narcissus/ as of 2010-02-09
//  * Modifications: Copyright (c) 2010 Guillaume Lathoud, MIT License.
//    See ./CHANGELOG.TXT for a summary of the changes.
//
//  * Supported Environments:
//    Google V8 Engine, Firefox 3.6, Safari 4, Google Chrome 4
//  
//  * Not supported yet:
//    Opera 10.10

/* ***** BEGIN LICENSE BLOCK *****
  * Version: MPL 1.1/GPL 2.0/LGPL 2.1
  *
  * The contents of this file are subject to the Mozilla Public License Version
  * 1.1 (the "License"); you may not use this file except in compliance with
  * the License. You may obtain a copy of the License at
  * http://www.mozilla.org/MPL/
  *
  * Software distributed under the License is distributed on an "AS IS" basis,
  * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
  * for the specific language governing rights and limitations under the
  * License.
  *
  * The Original Code is the Narcissus JavaScript engine.
  *
  * The Initial Developer of the Original Code is
  * Brendan Eich <brendan@mozilla.org>.
  * Portions created by the Initial Developer are Copyright (C) 2004
  * the Initial Developer. All Rights Reserved.
  *
  * Contributor(s):
  *
  * Alternatively, the contents of this file may be used under the terms of
  * either the GNU General Public License Version 2 or later (the "GPL"), or
  * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
  * in which case the provisions of the GPL or the LGPL are applicable instead
  * of those above. If you wish to allow use of your version of this file only
  * under the terms of either the GPL or the LGPL, and not to allow others to
  * use your version of this file under the terms of the MPL, indicate your
  * decision by deleting the provisions above and replace them with the notice
  * and other provisions required by the GPL or the LGPL. If you do not delete
  * the provisions above, a recipient may use your version of this file under
  * the terms of any one of the MPL, the GPL or the LGPL.
  *
  * ***** END LICENSE BLOCK ***** */

/*
  * Narcissus - JS implemented in JS.
  *
  * Well-known constants and lookup tables.  Many consts are generated from the
  * tokens table via eval to minimize redundancy, so consumers must be compiled
  * separately to take advantage of the simple switch-case constant propagation
  * done by SpiderMonkey.
  */

(function (GLOBAL) {

    GLOBAL.narcissus = GLOBAL.narcissus || {};

    var jsdef = GLOBAL.narcissus.jsdef = {};

    var tokens = jsdef.tokens = [
        // End of source.
        "END",
        
        // Operators and punctuators.  Some pair-wise order matters, e.g. (+, -)
        // and (UNARY_PLUS, UNARY_MINUS).
        "\n", ";", "...",
        ",",
        "=",
        "?", ":", "CONDITIONAL",
        "||",
        "&&",
        "|",
        "^",
        "&",
        "==", "!=", "===", "!==",
        "<", "<=", ">=", ">",
        "<<", ">>", ">>>",
        "+", "-",
        "*", "/", "%",
        "!", "~", "UNARY_PLUS", "UNARY_MINUS", "UNARY_EXISTS",
        "++", "--",
        ".",
        "[", "]",
        "{", "}",
        "(", ")",
        "**",
        
        // Nonterminal tree node type codes.
        "SCRIPT", "BLOCK", "LABEL", "FOR_IN", "CALL", "NEW_WITH_ARGS", "INDEX",
        "ARRAY_INIT", "OBJECT_INIT", "PROPERTY_INIT", "GETTER", "SETTER",
        "GROUP", "LIST", "FOR_INSIDE", "ARRAY_COMP",
        
        // Terminals.
        "IDENTIFIER", "NUMBER", "STRING", "REGEXP",
        
        // Keywords.
        "break",
        "class", "case", "catch", "const", "continue",
        "debugger", "default", "delete", "do",
        "else", "enum", "extends", "extension",
        "false", "finally", "for", "function",
        "if", "in", "inside", "instanceof", "is",
        "new", "null",
        "private", "protected", "public",
        "return",
        "static", "switch",
        "this", "throw", "true", "try", "typeof", "#typesys",
        "var", "void", "as", "let",
        "while", "with"
    ];

    // Operator and punctuator mapping from token to tree node type name.
    // NB: superstring tokens (e.g., ++) must come before their substring token
    // counterparts (+ in the example), so that the opRegExp regular expression
    // synthesized from this list makes the longest possible match.
    var opTypeNamesArr = jsdef.opTypeNamesArr = [
        [   '\n',   "NEWLINE"],
        [   ';',    "SEMICOLON"],
        [   ',',    "COMMA"],
        [   '...',  "RANGE"],
        [   '?',    "HOOK"],
        [   ':',    "COLON"],
        [   '||',   "OR"],
        [   '&&',   "AND"],
        [   '|',    "BITWISE_OR"],
        [   '^',    "BITWISE_XOR"],
        [   '&',    "BITWISE_AND"],
        [   '===',  "STRICT_EQ"],
        [   '==',   "EQ"],
        [   '=',    "ASSIGN"],
        [   '!==',  "STRICT_NE"],
        [   '!=',   "NE"],
        [   '<<',   "LSH"],
        [   '<=',   "LE"],
        [   '<',    "LT"],
        [   '>>>',  "URSH"],
        [   '>>',   "RSH"],
        [   '>=',   "GE"],
        [   '>',    "GT"],
        [   '++',   "INCREMENT"],
        [   '--',   "DECREMENT"],
        [   '**',   "EXPONENT"],
        [   '+',    "PLUS"],
        [   '-',    "MINUS"],
        [   '*',    "MUL"],
        [   '/',    "DIV"],
        [   '%',    "MOD"],
        [   '!',    "NOT"],
        [   '~',    "BITWISE_NOT"],
        [   '.',    "DOT"],
        [   '[',    "LEFT_BRACKET"],
        [   ']',    "RIGHT_BRACKET"],
        [   '{',    "LEFT_CURLY"],
        [   '}',    "RIGHT_CURLY"],
        [   '(',    "LEFT_PAREN"],
        [   ')',    "RIGHT_PAREN"],
        ['#typesys',"TYPESYS"]
    ];

    var opTypeNames = jsdef.opTypeNames = (function () {
        var ret = {}, x;
        for (var i = 0; i < opTypeNamesArr.length; i++){
            x = opTypeNamesArr[i];
            ret[x[0]] = x[1];
        }
        return ret;
    })();


    // Define const END, etc., based on the token names.  Also map name to index.
    
    var keywords = jsdef.keywords = (function () {

        // Hash of keyword identifier to tokens index.  NB: we must null __proto__ to
        // avoid toString, etc. namespace pollution. 
        //  var _keywords = {__proto__: null};

        // G. Lathoud's addition: This works however only on SpiderMonkey and the like,
        // so let's resort to a more basic approach with hasOwnProperty (see further below).
        // (this helps on Rhino 1.6).

        var _keywords = {};
        
        for (var i = 0, j = tokens.length; i < j; i++) {


            var a_const;
            
            var t = tokens[i];
            if (/^[a-z]/.test(t)) {
                a_const = t.toUpperCase();
                _keywords[t] = i;
            } else {
                a_const = (/^\W/.test(t) ? opTypeNames[t] : t);
            }
            
            jsdef[a_const] = i >> 0;
            
            tokens[t] = i;
        }

        return function (/*string*/id) {
            return _keywords.hasOwnProperty(id) && _keywords[id];
        };
    })();

    // Map assignment operators to their indexes in the tokens array.
    var assignOps = jsdef.assignOps = ['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%', '&&', '||', '**', '?'];

    for (var i = 0, j = assignOps.length; i < j; i++) {
        var t = assignOps[i];
        assignOps[t] = tokens[t];
    }
})(this);
