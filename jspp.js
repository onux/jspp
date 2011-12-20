/**********************************ARRAYS**********************************/

/*****Array.isArray*****/
if (!Array.isArray) Array.isArray = function(a) { return Object.prototype.toString.call(a) == "[object Array]" };

/*****Array.prototype.indexOf*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) Array.prototype.indexOf = function (searchElement) {
	if (this === void 0 || this === null) {
		throw new TypeError;
	}
	var t = Object(this);
	var len = t.length >>> 0;
	if (len === 0) {
		return -1;
	}
	var n = 0;
	if (arguments.length > 0) {
		n = +arguments[1];
		if (n !== n) { // shortcut for verifying if it's NaN
			n = 0;
		}else if (n !== 0 && n !== Infinity && n !== -Infinity) {
			n = (n > 0 || -1) * ~~(Math.abs(n));
		}
	}
	if (n >= len) {
		return -1;
	}
	var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
	for (; k < len; k++) {
		if (k in t && t[k] === searchElement) {
			return k;
		}
	}
	return -1;
};

/*****Array.prototype.lastIndexOf*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf = function(searchElement) {
	if (this === void 0 || this === null)
		throw new TypeError;

	var t = Object(this);
	var len = t.length >>> 0;
	if (len === 0)
		return -1;

	var n = len;
	if (arguments.length > 1) {
		n = Number(arguments[1]);
		if (n !== n)
			n = 0;
		else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
			n = (n > 0 || -1) * Math.floor(Math.abs(n));
	}

	var k = n >= 0
		  ? Math.min(n, len - 1)
		  : len - Math.abs(n);

	for (; k >= 0; k--) {
		if (k in t && t[k] === searchElement)
			return k;
	}
	return -1;
};

/*****Array.prototype.filter*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) Array.prototype.filter = function(fun) {
	if (this === void 0 || this === null)
		throw new TypeError;

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun !== "function")
		throw new TypeError;

	var res = [];
	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
		if (i in t) {
			var val = t[i]; // in case fun mutates this
			if (fun.call(thisp, val, i, t))
				res.push(val);
		}
	}

	return res;
};

/*****Array.prototype.forEach*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) Array.prototype.forEach = function(callback, thisArg) {
	var T, k;

	if (this == null) {
		throw new TypeError(" this is null or not defined");
	}

	var O = Object(this);
	var len = O.length >>> 0;

	if (Object.prototype.toString.call(callback) != "[object Function]") {
		throw new TypeError(callback + " is not a function");
	}

	if (thisArg) {
		T = thisArg;
	}

	k = 0;

	while(k < len) {
		var kValue;

		if (k in O) {
			kValue = O[Pk];

			callback.call(T, kValue, k, O);
		}
		k++;
	}
};

/*****Array.prototype.every*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) Array.prototype.every = function(fun) {
	if (this === void 0 || this === null)
		throw new TypeError();

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun != "function")
		throw new TypeError();

	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
		if (i in t && !fun.call(thisp, t[i], i, t))
			return false;
	}

	return true;
};

/*****Array.prototype.map*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
if (!Array.prototype.map) Array.prototype.map = function(callback, thisArg) {
	var T, A, k;

	if (this == null) {
		throw new TypeError(" this is null or not defined");
	}

	var O = Object(this);
	var len = O.length >>> 0;

	if (Object.prototype.toString.call(callback) != "[object Function]") {
		throw new TypeError(callback + " is not a function");
	}

	if (thisArg) {
		T = thisArg;
	}

	A = new Array(len); //Use array constructor for performance

	k = 0;

	while(k < len) {
		var kValue, mappedValue;

		if (k in O) {
			kValue = O[k];

			mappedValue = callback.call(T, kValue, k, O);
		
			A[k] = mappedValue;
		}
		k++;
	}

	return A;
};

/*****Array.prototype.some*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) Array.prototype.some = function(fun) {
	if (this === void 0 || this === null)
		throw new TypeError;

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun != "function")
		throw new TypeError;

	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
		if (i in t && fun.call(thisp, t[i], i, t))
			return true;
	}

	return false;
};

/*****Array.prototype.reduce*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
if (!Array.prototype.reduce) Array.prototype.reduce = function reduce(accumlator){
	var i, l = this.length, curr;

	if (typeof accumlator != "function")
		throw new TypeError("First argument is not callable");

	if((l == 0 || l === null) && (arguments.length <= 1)) // == on purpose to test 0 and false.
		throw new TypeError("Array length is 0 and no second argument");

	if(arguments.length <= 1){
		curr = this[0];
		i = 1;
	}
	else{
		curr = arguments[1];
	}

	for(i = i || 0 ; i < l ; ++i) {
		if(i in this)
			curr = accumlator.call(void 0, curr, this[i], i, this);
	}

	return curr;
};

/*****Array.prototype.reduceRight*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/ReduceRight
if (!Array.prototype.reduceRight) Array.prototype.reduceRight = function(callbackfn) {
	if (this === void 0 || this === null)
		throw new TypeError();

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof callbackfn != "function")
		throw new TypeError;

	// no value to return if no initial value, empty array
	if (len === 0 && arguments.length === 1)
		throw new TypeError;

	var k = len - 1;
	var accumulator;
	if (arguments.length >= 2) {
		accumulator = arguments[1];
	}
	else {
		do
		{
			if (k in this) {
				accumulator = this[k--];
				break;
			}

			// if array contains no values, no initial value to return
			if (--k < 0)
		  		throw new TypeError;
		}
		while (true);
	}

	while (k >= 0) {
		if (k in t)
			accumulator = callbackfn.call(void 0, accumulator, t[k], k, t);
		k--;
	}

	return accumulator;
};

/**********************************DATES**********************************/

if (!Date.now) Date.now = function() { return +new Date };

if (!Date.prototype.toISOString) Date.prototype.toISOString = function() {
	if (!isFinite(this)) throw RangeError;

	var d    = new Date,
		year = d.getUTCFullYear(),
		month= d.getUTCMonth() + 1 + "",
		day  = d.getUTCDate() + "",
		hours= d.getUTCHours() + "",
		mins = d.getUTCMinutes() + "",
		secs = d.getUTCSeconds() + "",
		ms   = d.getUTCMilliseconds() + "";
		
	while (month.length < 2) month = "0" + month;
	while (day.length   < 2) day   = "0" + day;
	while (hours.length < 2) hours = "0" + hours;
	while (mins.length  < 2) mins  = "0" + mins;
	while (secs.length  < 2) secs  = "0" + secs;
	while (ms.length    < 3) ms    = "0" + ms;
	
	return year + "-" + month + "-" + day + "T" + hours + ":" + mins + ":" + secs + "." + ms + "Z";
};

if (!Date.prototype.toJSON) Date.prototype.toJSON = function() {
	if (typeof this.toISOString != "function")
		throw TypeError("Property 'toISOString' of object " + this + " is not a function");
	
	return this.toISOString();
};

/**********************************FUNCTIONS**********************************/

/*****Function.prototype.bind*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) Function.prototype.bind = function (oThis) {
	if (typeof this != "function")
		throw new TypeError("Function.prototype.bind - what is trying to be fBound is not callable");

	var aArgs = Array.prototype.slice.call(arguments, 1), 
		fToBind = this, 
		fNOP = function () {},
		fBound = function () {
			return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));    
		};

	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();

	return fBound;
};

/**********************************OBJECTS**********************************/

/*****Object.keys*****/
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
if(!Object.keys) Object.keys = function(o){
	if (o !== Object(o))
		throw new TypeError('Object.keys called on non-object');
	var ret=[],p;
	for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
	return ret;
};

/**********************************STRINGS**********************************/

String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/gm) };
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
//
// Note that the narcissus parser requires `Array` to be fully
// prototype-derivable. This excludes Internet Explorer, at least up
// to version 8.


/*global from narcissus*/

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
 * Lexical scanner and parser.
 */

(function (GLOBAL) {

    var _install = function () {

        GLOBAL.narcissus.jsparse = (function () {

            var jsdef = GLOBAL.narcissus.jsdef;

            // Build a regexp that recognizes operators and punctuators (except newline).
            var opRegExpSrc = (function () {
                var ret = "^", a, i;
                for (var a = 0; a < jsdef.opTypeNamesArr.length; a++){
                    i = jsdef.opTypeNamesArr[a][0];
                    if (i == '\n')
                        continue;
                    if (ret != "^")
                        ret += "|^";
                    ret += i.replace(/[?|^&(){}\[\]+\-*\/\.]/g, "\\$&");
                }
                return ret;
            })();

            var opRegExp = new RegExp(opRegExpSrc);

            // A regexp to match floating point literals (but not integer literals).
            //var fpRegExp = /^\d+\.\d*(?:[eE][-+]?\d+)?|^\d+(?:\.\d*)?[eE][-+]?\d+|^\.\d+(?:[eE][-+]?\d+)?/;
            //The below regex prevents '1..toString()' but not '1 .toString()' so we can implement the spread operator
            var fpRegExp = /^\d+\.(?!\.)\d*(?:[eE][-+]?\d+)?|^\d+(?:\.\d*)?[eE][-+]?\d+|^\.\d+(?:[eE][-+]?\d+)?/;

            // A regexp to match regexp literals.
            //var reRegExp = /^\/((?:\\.|\[(?:\\.|[^\]])*\]|[^\/])+)\/([gimy]*)/;
            var reRegExp = /^(?:m(x)?|(?=\/))([^\w\s\\])((?:\\.|(?!\2)[^\\])*)\2([a-z]*)/;
            
            var scopeId = 0;
            
        	var ArrayTypes = ["ArrayArray", "BooleanArray", "DateArray",
        		  "FunctionArray", "NumberArray", "ObjectArray", "RegExpArray",
				  "StringArray"];

            function Tokenizer(s, f, l) {
                this.cursor = 0;
                this.source = String(s);
                this.tokens = [];
                this.tokenIndex = 0;
                this.lookahead = 0;
                this.scanNewlines = false;
                this.scanOperand = true;
                this.filename = f || "";
                this.lineno = l || 1;
            }

            Tokenizer.prototype = {
                input: function() {
                    return this.source.substring(this.cursor);
                },

                done: function() {
                    return this.peek() == jsdef.END;
                },

                token: function() {
                    return this.tokens[this.tokenIndex];
                },

                match: function (tt) {
                    return this.get() == tt || this.unget();
                },

                mustMatch: function (tt) {
                    if (!this.match(tt))
                        throw this.newSyntaxError("Missing " + jsdef.tokens[tt].toLowerCase());
                    return this.token();
                },

                peek: function () {
                    var tt, next;
                    if (this.lookahead) {
                        next = this.tokens[(this.tokenIndex + this.lookahead) & 3];
                        if (this.scanNewlines && next.lineno != this.lineno)
                            tt = jsdef.NEWLINE;
                        else
                            tt = next.type;
                    } else {
                        tt = this.get();
                        this.unget();
                    }
                    return tt;
                },

                peekOnSameLine: function () {
                    this.scanNewlines = true;
                    var tt = this.peek();
                    this.scanNewlines = false;
                    return tt;
                },

                get: function () {
                    var token;
                    while (this.lookahead) {
                        --this.lookahead;
                        this.tokenIndex = (this.tokenIndex + 1) & 3;
                        token = this.tokens[this.tokenIndex];
                        if (token.type != jsdef.NEWLINE || this.scanNewlines) {
                            return token.type;
                        }
                    }

                    for (;;) {
                        var input = this.input();
                        var match = (this.scanNewlines ? /^[ \t]+/ : /^\s+/).exec(input);
                        if (match) {
                            var spaces = match[0];
                            this.cursor += spaces.length;
                            var newlines = spaces.match(/\n/g);
                            if (newlines)
                                this.lineno += newlines.length;
                            input = this.input();
                        }

                        if (!(match = /^\/(?:\*(?:[\S\s])*?\*\/|\/.*)/.exec(input)))
                            break;
                        var comment = match[0];
                        this.cursor += comment.length;
                        newlines = comment.match(/\n/g);
                        if (newlines)
                            this.lineno += newlines.length;
                    }

                    this.tokenIndex = (this.tokenIndex + 1) & 3;
                    token = this.tokens[this.tokenIndex];
                    if (!token)
                        this.tokens[this.tokenIndex] = token = {};

                    if (!input) {
                        return token.type = jsdef.END;
                    }

                    if ((match = fpRegExp.exec(input))) {
                        token.type = jsdef.NUMBER;
                        token.value = parseFloat(match[0]);
                    } else if ((match = /^0[xX][\da-fA-F]+|^0[0-7]*|^\d+/.exec(input))) {
                        token.type = jsdef.NUMBER;
                        token.value = parseInt(match[0]);
                    } else if ((match = /^[$\w]+/.exec(input)) && !reRegExp.test(input)) {       // FIXME no ES3 unicode
                        var id = match[0];
                        token.type = jsdef.keywords(id) || jsdef.IDENTIFIER;
                        token.value = id;
                    } else if ((match = /^"(?!")(?:\\.|[^"])*"|^'(?!')(?:\\.|[^'])*'|^(['"]{3})((?:(?!\1)[\s\S])*)\1|^""|^''/.exec(input))) { // "){
                        token.type = jsdef.STRING;
                        
                        if (match[1]) {
                        	this.lineno += match[2].split(/\r?\n/gm).length-1;
                        	token.value = match[2].split(/\r?\n\r?/gm);
                        }
                        else {
                        	this.lineno += match[0].split(/\r?\n/gm).length-1;
		                    token.value = match[0].replace(/^['"]|['"]$/gm, "");
		                }
                } else if (this.scanOperand && (match = reRegExp.exec(input))) {
                    token.type = jsdef.REGEXP;
                    token.value = [match[1], match[2], match[3], match[4]];
                } else if ((match = opRegExp.exec(input))) {
                    var op = match[0];
                    if (jsdef.assignOps[op] && input[op.length] == '=') {
                        token.type = jsdef.ASSIGN;
                        token.assignOp = jsdef[jsdef.opTypeNames[op]];
                        match[0] += '=';
                    } else {
                        token.type = jsdef[jsdef.opTypeNames[op]];
                        if (this.scanOperand &&
                            (token.type == jsdef.PLUS || token.type == jsdef.MINUS ||
                             token.type == jsdef.HOOK)) {
                            if (token.type == jsdef.HOOK) {
	                            token.type = jsdef.tokens.indexOf("UNARY_EXISTS");
	                        }else {
                            	token.type += jsdef.UNARY_PLUS - jsdef.PLUS;
                            }
                        }
                        token.assignOp = null;
                    }
                    token.value = op;
                } else if (this.scanNewlines && (match = /^\n/.exec(input))) {
                    token.type = jsdef.NEWLINE;
                } else {
                    throw this.newSyntaxError("Illegal token");
                }

                token.start = this.cursor;
                this.cursor += match[0].length;
                token.end = this.cursor;
                token.lineno = this.lineno;

                return token.type;
            },

            unget: function () {
                if (++this.lookahead == 4) throw "PANIC: too much lookahead!";
                this.tokenIndex = (this.tokenIndex - 1) & 3;
            },

            newSyntaxError: function (m) {
                var e = new SyntaxError(m + ', filename:' + this.filename + ', lineno:' + this.lineno);
                e.source = this.source;
                e.cursor = this.cursor;
                return e;
            }
        };

        function CompilerContext(inFunction) {
            this.inFunction = inFunction;
            this.stmtStack = [];
            this.funDecls = [];
            this.varDecls = [];
        }

        var CCp = CompilerContext.prototype;
        CCp.bracketLevel = CCp.curlyLevel = CCp.parenLevel = CCp.hookLevel = 0;
        CCp.ecmaStrictMode = CCp.inForLoopInit = false;

		var contextId = 0;
        function Script(t, x) {
            var n = Statements(t, x);
            n.type = jsdef.SCRIPT;
            n.funDecls = x.funDecls;
            n.varDecls = x.varDecls;
            n.contextId = ++contextId;
            n.scopeId = ++scopeId;
            return n;
        }

        // Node extends Array, which we extend slightly with a top-of-stack method.
        Array.prototype.top = function () {
            return this.length && this[this.length-1];
        };

        function Node(t, type) {
            var token = t.token();
            if (token) {
                this.type = type || token.type;
                this.value = token.value;
                this.lineno = token.lineno;
                this.start = token.start;
                this.end = token.end;
            } else {
                this.type = type;
                this.lineno = t.lineno;
            }
            this.tokenizer = t;

            for (var i = 2; i < arguments.length; i++)
                this.push(arguments[i]);
        }

        var Np = Node.prototype = new Array;
        Np.constructor = Node;
        Np.toSource = Object.prototype.toSource;

        // Always use push to add operands to an expression, to update start and end.
        Np.push = function (kid) {
            if (!kid) 
                throw this.tokenizer.newSyntaxError('Empty child expression!');
            if (kid.start < this.start)
                this.start = kid.start;
            if (this.end < kid.end)
                this.end = kid.end;
            return Array.prototype.push.call(this, kid);
        };

        Node.indentLevel = 0;

        function tokenstr(tt) {
            var t = jsdef.tokens[tt];
            return /^\W/.test(t) ? jsdef.opTypeNames[t] : t.toUpperCase();
        }

        Np.toString = function () {
            var a = [];
            for (var i in this) {
                if (this.hasOwnProperty(i) && i != 'type' && i != 'target')
                    a.push({id: i, value: this[i]});
            }
            a.sort(function (a,b) { return (a.id < b.id) ? -1 : 1; });
            jsdef.INDENTATION = "    ";
            var n = ++Node.indentLevel;
            var s = "{\n" + jsdef.INDENTATION.repeat(n) + "type: " + tokenstr(this.type);
            for (i = 0; i < a.length; i++)
                s += ",\n" + jsdef.INDENTATION.repeat(n) + a[i].id + ": " + a[i].value;
            n = --Node.indentLevel;
            s += "\n" + jsdef.INDENTATION.repeat(n) + "}";
            return s;
        };

        Np.getSource = function () {
            return this.tokenizer.source.slice(this.start, this.end);
        };

        Np.filename = function () { return this.tokenizer.filename; };

        String.prototype.repeat = function (n) {
            var s = "", t = this + s;
            while (--n >= 0)
                s += t;
            return s;
        };

        // Statement stack and nested statement handler.
        function nest(t, x, node, func, end) {
            x.stmtStack.push(node);
            var n = func(t, x);
            x.stmtStack.pop();
            end && t.mustMatch(end);
            return n;
        }

		var blockId = 0;
        function Statements(t, x) {
            var n = new Node(t, jsdef.BLOCK);
            x.stmtStack.push(n);
            while (!t.done() && t.peek() != jsdef.RIGHT_CURLY)
                n.push(Statement(t, x));
            x.stmtStack.pop();
            
            n.blockId = ++blockId;
            n.scopeId = ++scopeId;
            
            return n;
        }

        function Block(t, x) {
            t.mustMatch(jsdef.LEFT_CURLY);
            var n = Statements(t, x);
            t.mustMatch(jsdef.RIGHT_CURLY);
            return n;
        }

        var DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2;

        function Statement(t, x) {
            var i, label, n, n2, ss, tt = t.get();

            // Cases for statements ending in a right curly return early, avoiding the
            // common semicolon insertion magic after this switch.
            switch (tt) {
            case jsdef.FUNCTION:
                return FunctionDefinition(t, x, true,
                                          (x.stmtStack.length > 1)
                                          ? STATEMENT_FORM
                                          : DECLARED_FORM);
                                          
            case jsdef.CLASS:
            	return ClassDefinition(t, x, true,
                                          (x.stmtStack.length > 1)
                                          ? STATEMENT_FORM
                                          : DECLARED_FORM);

            case jsdef.LEFT_CURLY:
                n = Statements(t, x);
                t.mustMatch(jsdef.RIGHT_CURLY);
                return n;
                
            case jsdef.EXTENSION:
            	n = new Node(t);
            	
            	t.mustMatch(jsdef.IDENTIFIER);
            	
            	var root = new Node(t), dots = [root];
            	
            	if (t.peek() == jsdef.DOT) {
		        	do {
		        		if (!t.match(jsdef.DOT)) break;				    	
					    t.mustMatch(jsdef.IDENTIFIER);
				        dots.push(new Node(t, jsdef.DOT, dots[dots.length-1], new Node(t)));
			        } while (t.peek() != jsdef.LEFT_CURLY);
			        
			        n2 = dots.pop();
	            }else {
		        	n2 = new Node(t);
		        }
	            
	            n.object = n2;
	            
	            if (t.peek() == jsdef.LEFT_CURLY) {
		            n.extend = Expression(t, x);
		        }
		        
		        if (!n.extend || (n.extend && n.extend.type != jsdef.OBJECT_INIT)) {
			        throw t.newSyntaxError("Invalid object extension");
		        }
            	
            	return n;

            case jsdef.IF:
                n = new Node(t);
                n.condition = ParenExpression(t, x);
                x.stmtStack.push(n);
                n.thenPart = Statement(t, x);
                n.elsePart = t.match(jsdef.ELSE) ? Statement(t, x) : null;
                x.stmtStack.pop();
                return n;

            case jsdef.SWITCH:
                n = new Node(t);
                t.mustMatch(jsdef.LEFT_PAREN);
                n.discriminant = Expression(t, x);
                t.mustMatch(jsdef.RIGHT_PAREN);
                n.cases = [];
                n.defaultIndex = -1;
                x.stmtStack.push(n);
                t.mustMatch(jsdef.LEFT_CURLY);
                while ((tt = t.get()) != jsdef.RIGHT_CURLY) {
                    switch (tt) {
                    case jsdef.DEFAULT:
                        if (n.defaultIndex >= 0)
                            throw t.newSyntaxError("More than one switch default");
                        // FALL THROUGH
                    case jsdef.CASE:
                        n2 = new Node(t);
                        if (tt == jsdef.DEFAULT)
                            n.defaultIndex = n.cases.length;
                        else
                            n2.caseLabel = Expression(t, x, jsdef.COLON);
                        break;
                    default:
                        throw t.newSyntaxError("Invalid switch case");
                    }
                    t.mustMatch(jsdef.COLON);
                    n2.statements = new Node(t, jsdef.BLOCK);
                    while ((tt=t.peek()) != jsdef.CASE && tt != jsdef.DEFAULT && tt != jsdef.RIGHT_CURLY)
                        n2.statements.push(Statement(t, x));
                    n.cases.push(n2);
                }
                x.stmtStack.pop();
                return n;

            case jsdef.FOR:
                n = new Node(t);
                n.isLoop = true;
                t.mustMatch(jsdef.LEFT_PAREN);
                if ((tt = t.peek()) != jsdef.SEMICOLON) {
                    x.inForLoopInit = true;
                    if (tt == jsdef.VAR || tt == jsdef.CONST || tt == jsdef.LET) {
                        t.get();
                        n2 = Variables(t, x);
                    } else {
                        n2 = Expression(t, x);
                    }
                    x.inForLoopInit = false;
                }
                if (n2 && t.match(jsdef.IN)) {
                    n.type = jsdef.FOR_IN;
                    if (n2.type == jsdef.VAR || n2.type == jsdef.LET) {
                        if (n2.length != 1) {
                            throw new SyntaxError("Invalid for..in left-hand side",
                                                  t.filename, n2.lineno);
                        }

                        n.iterator = n2;
                        n.varDecl = n2;
                    } else {
                        n.iterator = n2;
                        n.varDecl = null;
                    }
                    n.object = Expression(t, x);
                }
                else if (n2 && t.match(jsdef.INSIDE)) {
                    n.type = jsdef.FOR_INSIDE;
                    if (n2.type == jsdef.VAR || n2.type == jsdef.LET) {
                        if (n2.length != 1) {
                            throw new SyntaxError("Invalid for..inside left-hand side",
                                                  t.filename, n2.lineno);
                        }

                        n.iterator = n2;
                        n.varDecl = n2;
                    } else {
                        n.iterator = n2;
                        n.varDecl = null;
                    }
                    n.object = Expression(t, x);
                }
                else {
                    n.setup = n2 || null;
                    t.mustMatch(jsdef.SEMICOLON);
                    n.condition = (t.peek() == jsdef.SEMICOLON) ? null : Expression(t, x);
                    t.mustMatch(jsdef.SEMICOLON);
                    n.update = (t.peek() == jsdef.RIGHT_PAREN) ? null : Expression(t, x);
                }
                t.mustMatch(jsdef.RIGHT_PAREN);
                n.body = nest(t, x, n, Statement);
                
                return n;

            case jsdef.WHILE:
                n = new Node(t);
                n.isLoop = true;
                n.condition = ParenExpression(t, x);
                n.body = nest(t, x, n, Statement);
                return n;

            case jsdef.DO:
                n = new Node(t);
                n.isLoop = true;
                n.body = nest(t, x, n, Statement, jsdef.WHILE);
                n.condition = ParenExpression(t, x);
                if (!x.ecmaStrictMode) {
                    // <script language="JavaScript"> (without version hints) may need
                    // automatic semicolon insertion without a newline after do-while.
                    // See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
                    t.match(jsdef.SEMICOLON);
                    return n;
                }
                break;

            case jsdef.BREAK:
            case jsdef.CONTINUE:
                n = new Node(t);
                if (t.peekOnSameLine() == jsdef.IDENTIFIER) {
                    t.get();
                    n.label = t.token().value;
                }
                ss = x.stmtStack;
                i = ss.length;
                label = n.label;
                if (label) {
                    do {
                        if (--i < 0)
                            throw t.newSyntaxError("Label not found");
                    } while (ss[i].label != label);
                } else {
                    do {
                        if (--i < 0) {
                            throw t.newSyntaxError("Invalid " + ((tt == jsdef.BREAK)
                                                                 ? "break"
                                                                 : "continue"));
                        }
                    } while (!ss[i].isLoop && (tt != jsdef.BREAK || ss[i].type != jsdef.SWITCH));
                }
                n.target = ss[i];
                break;

            case jsdef.TRY:
                n = new Node(t);
                n.tryBlock = Block(t, x);
                n.catchClauses = [];
                while (t.match(jsdef.CATCH)) {
                    n2 = new Node(t);
                    t.mustMatch(jsdef.LEFT_PAREN);
                    n2.varName = t.mustMatch(jsdef.IDENTIFIER).value;
                    if (t.match(jsdef.IF)) {
                        if (x.ecmaStrictMode)
                            throw t.newSyntaxError("Illegal catch guard");
                        if (n.catchClauses.length && !n.catchClauses.top().guard)
                            throw t.newSyntaxError("Guarded catch after unguarded");
                        n2.guard = Expression(t, x);
                    } else {
                        n2.guard = null;
                    }
                    t.mustMatch(jsdef.RIGHT_PAREN);
                    n2.block = Block(t, x);
                    n.catchClauses.push(n2);
                }
                if (t.match(jsdef.FINALLY))
                    n.finallyBlock = Block(t, x);
                if (!n.catchClauses.length && !n.finallyBlock)
                    throw t.newSyntaxError("Invalid try statement");
                return n;

            case jsdef.CATCH:
            case jsdef.FINALLY:
                throw t.newSyntaxError(jsdef.tokens[tt] + " without preceding try");

            case jsdef.THROW:
                n = new Node(t);
                n.exception = Expression(t, x);
                break;

            case jsdef.RETURN:
                if (!x.inFunction)
                    throw t.newSyntaxError("Invalid return");
                n = new Node(t);
                tt = t.peekOnSameLine();
                if (tt != jsdef.END && tt != jsdef.NEWLINE && tt != jsdef.SEMICOLON && tt != jsdef.RIGHT_CURLY)
                    n.value = Expression(t, x);
                break;

            case jsdef.WITH:
                n = new Node(t);
                n.object = ParenExpression(t, x);
                n.body = nest(t, x, n, Statement);
                return n;

            case jsdef.VAR:
            case jsdef.CONST:
                n = Variables(t, x);
                break;
            case jsdef.LET:
                n = Variables(t, x);
                n.block = true;
                break;

            case jsdef.DEBUGGER:
                n = new Node(t);
                break;

            case jsdef.NEWLINE:
            case jsdef.SEMICOLON:
                n = new Node(t, jsdef.SEMICOLON);
                n.expression = null;
                return n;

            default:
                if (tt == jsdef.IDENTIFIER) {
                    t.scanOperand = false;
                    tt = t.peek();
                    t.scanOperand = true;
                    if (tt == jsdef.COLON) {
                        label = t.token().value;
                        ss = x.stmtStack;
                        for (i = ss.length-1; i >= 0; --i) {
                            if (ss[i].label == label)
                                throw t.newSyntaxError("Duplicate label");
                        }
                        t.get();
                        n = new Node(t, jsdef.LABEL);
                        n.label = label;
                        n.statement = nest(t, x, n, Statement);
                        return n;
                    }
                }

                n = new Node(t, jsdef.SEMICOLON);
                t.unget();
                n.expression = Expression(t, x);
                n.end = n.expression.end;
                break;
            }

            if (t.lineno == t.token().lineno) {
                tt = t.peekOnSameLine();
                if (tt != jsdef.END && tt != jsdef.NEWLINE && tt != jsdef.SEMICOLON && tt != jsdef.RIGHT_CURLY)
                    throw t.newSyntaxError("Missing ; before statement");
            }
            t.match(jsdef.SEMICOLON);
            return n;
        }

        function FunctionDefinition(t, x, requireName, functionForm) {
            var f = new Node(t);
            if (f.type != jsdef.FUNCTION)
                f.type = (f.value == "get") ? jsdef.GETTER : jsdef.SETTER;
            if (t.match(jsdef.IDENTIFIER))
                f.name = t.token().value;
            else if (requireName)
                throw t.newSyntaxError(jsparse.MISSING_FUNCTION_IDENTIFIER);
                
            if (t.match(jsdef.AS) && t.mustMatch(jsdef.IDENTIFIER)) {
            	f.returntype = t.token().value;
            	
            	if (t.match(jsdef.LEFT_BRACKET)) {
	            	t.mustMatch(jsdef.RIGHT_BRACKET);
	            	f.returntype += "[]";
	            }else {
		            f.returntype = new Node(t).value;
		            
		            //Convert StringArray to String[], NumberArray to
		            //Number[], etc.
		            f.returntype = ~ArrayTypes.indexOf(f.returntype) ?
						f.returntype.replace(/Array$/, "[]") :
						f.returntype;
		        }
            	
            	if (t.match(jsdef.NOT)) f.returntype += "!";
			}
            
            t.mustMatch(jsdef.LEFT_PAREN);
            f.params = [];
            f.paramsList = [];
            var n2;
            
            if (t.peek() == jsdef.RIGHT_PAREN) {
            	t.mustMatch(jsdef.RIGHT_PAREN);
            }
            else {
            	var tt, restParam = false;
            	tt = t.get();
		        do {
		        	if (tt == jsdef.RANGE) {
		        		t.get();
		        		restParam = true;
		        	}
                    else if (tt != jsdef.IDENTIFIER)
                    	throw t.newSyntaxError("Missing formal parameter");
                    	
		            n2 = new Node(t);
		            n2.name = n2.value;
		            if (t.match(jsdef.AS)) {
		            	if (t.token().assignOp)
		                    throw t.newSyntaxError("Invalid parameter initialization");
		                t.mustMatch(jsdef.IDENTIFIER);
		                n2.vartype = new Node(t).value;
		                
		                if (t.match(jsdef.LEFT_BRACKET)) {
				        	t.mustMatch(jsdef.RIGHT_BRACKET);
				        	n2.vartype += "[]";
				        }else {
					        n2.vartype = new Node(t).value;
					        
					        //Convert StringArray to String[], NumberArray to
					        //Number[], etc.
					        n2.vartype = ~ArrayTypes.indexOf(n2.vartype) ?
								n2.vartype.replace(/Array$/, "[]") :
								n2.vartype;
					    }
		                
		                if (t.match(jsdef.NOT)) n2.vartype += "!";
					}
		            if (t.match(jsdef.ASSIGN)) {
		                if (t.token().assignOp || restParam)
		                    throw t.newSyntaxError("Invalid variable initialization");
		                n2.initializer = Expression(t, x, jsdef.COMMA);
		            }
		            if (restParam) n2.restParameter = true;
		            f.params.push(n2.value);
		            f.paramsList.push(n2);
		            
		            if (restParam && t.peek() != jsdef.RIGHT_PAREN) {
			            throw t.newSyntaxError("Rest parameters must be the last paramter");
		            }
		            else if (t.peek() != jsdef.RIGHT_PAREN) {
		                t.mustMatch(jsdef.COMMA);
		                
		                //Rest parameters
		                if (t.peek() == jsdef.RANGE) {
		                	t.mustMatch(jsdef.RANGE);
		                	restParam = true;
		                }
		                else if (t.peek() != jsdef.IDENTIFIER)
		                	throw t.newSyntaxError("Missing formal parameter");
		            }
		        } while ((tt = t.get()) != jsdef.RIGHT_PAREN);
		    }
		    
            f.static = t.static;
            f.private = t.private;
            f.public = t.public;
            f.protected = t.protected;
            
            //Set all access modifiers to false so the function body is unaffected
            t.static = false;
            t.private = false;
            t.public = false;
            t.protected = false;

			var x2;
            if (t.match(jsdef.LEFT_CURLY)) {
            	x2 = new CompilerContext(true);
            	f.body = Script(t, x2);
            	t.mustMatch(jsdef.RIGHT_CURLY);
            }
            else {
            	x2 = new CompilerContext(true);
            	
            	var n3 = new Node(t);
		        n3.type = jsdef.SCRIPT;
		        n3.funDecls = x2.funDecls;
		        n3.varDecls = x2.varDecls;
		        n3.contextId = ++contextId;
		        n3.scopeId = ++scopeId;
		        t.expClosure = true;
		        n3[0] = Expression(t, x2);
		        if (n3[0].type != jsdef.RETURN) {
			        throw t.newSyntaxError("Missing return in expression closure");
		        }
		        
            	f.body = n3;
            }
            f.end = t.token().end;

            f.functionForm = functionForm;
            if (functionForm == DECLARED_FORM)
                x.funDecls.push(f);
            return f;
        }
        
        function ClassDefinition(t, x, requireName, classForm) {
            var f = new Node(t);
            if (f.type != jsdef.CLASS)
                f.type = (f.value == "get") ? jsdef.GETTER : jsdef.SETTER;
            if (t.match(jsdef.IDENTIFIER))
                f.name = t.token().value;
            else if (requireName)
                throw t.newSyntaxError(jsparse.MISSING_FUNCTION_IDENTIFIER);
            
            if (t.match(jsdef.EXTENDS) || t.match(jsdef.COLON)) {
            	t.get();
            	f.extends = t.token().value;
			}

            t.mustMatch(jsdef.LEFT_CURLY);
            var x2 = new CompilerContext(true);
            f.body = (function(t, x) {
            	var n = new Node(t, jsdef.BLOCK), peek;
            	x.stmtStack.push(n);

            	do {
            		t.static = false;
            		t.private = false;
            		t.public = false;
            		t.protected = false;
            		if (t.token().type == jsdef.PRIVATE) {
            			t.private = true;
            			
            			if ((peek = t.peek()) != jsdef.STATIC
            				&& peek != jsdef.VAR
            				&& peek != jsdef.FUNCTION)
            				 throw t.newSyntaxError("Invalid class initialization");
            			
            			if (t.match(jsdef.STATIC)) t.static = true;
            			
            			if (t.match(jsdef.VAR)) {
            				n.push(Variables(t,x));
            			}
            			else if (t.match(jsdef.FUNCTION)) {
            				n.push(FunctionDefinition(t, x, false, DECLARED_FORM));
						}
            		}
            		else if (t.token().type == jsdef.PUBLIC) {
            			t.public = true;
            			
            			if ((peek = t.peek()) != jsdef.STATIC
            				&& peek != jsdef.VAR
            				&& peek != jsdef.FUNCTION)
            				 throw t.newSyntaxError("Invalid class initialization");
            			
            			if (t.match(jsdef.STATIC)) t.static = true;
            			
            			if (t.match(jsdef.VAR)) {
            				n.push(Variables(t,x));
            			}
            			else if (t.match(jsdef.FUNCTION)) {
            				n.push(FunctionDefinition(t, x, false, DECLARED_FORM));
						}
            		}
            		else if (t.token().type == jsdef.PROTECTED) {
            			t.protected = true;
            			
            			if ((peek = t.peek()) != jsdef.STATIC
            				&& peek != jsdef.VAR
            				&& peek != jsdef.FUNCTION)
            				 throw t.newSyntaxError("Invalid class initialization");
            			
            			if (t.match(jsdef.STATIC)) t.static = true;
            			
            			if (t.match(jsdef.VAR)) {
            				n.push(Variables(t,x));
            			}
            			else if (t.match(jsdef.FUNCTION)) {
            				n.push(FunctionDefinition(t, x, false, DECLARED_FORM));
						}
            		}
            		else if (t.token().type == jsdef.STATIC) {
            			t.static = true;
            			
            			if ((peek = t.peek()) != jsdef.VAR && peek != jsdef.FUNCTION)
            				 throw t.newSyntaxError("Invalid class initialization");
            				 
            			if (t.match(jsdef.VAR)) {
            				n.push(Variables(t,x));
            			}
            			else if (t.match(jsdef.FUNCTION)) {
            				n.push(FunctionDefinition(t, x, false, DECLARED_FORM));
						}
            		}
            		else if (t.token().type == jsdef.CLASS) {
            			n.push(ClassDefinition(t, x, true, DECLARED_FORM));
            		}
            		else if (t.token().type != jsdef.SEMICOLON &&
            				 t.token().type != jsdef.LEFT_CURLY) {
	            		throw t.newSyntaxError("Invalid class initialization");
            		}
            		x.stmtStack.pop();
				} while(t.get() != jsdef.RIGHT_CURLY);
				
	            n.blockId = ++blockId;
    	        n.scopeId = ++scopeId;
    	        
	            n.type = jsdef.SCRIPT;
	            n.funDecls = x.funDecls;
	            n.varDecls = x.varDecls;
	            n.contextId = ++contextId;
	            n.scopeId = ++scopeId;
	            return n;
            })(t, x2);
            f.end = t.token().end;

            f.classForm = classForm;
            if (classForm == DECLARED_FORM)
                x.funDecls.push(f);
            return f;
        }

        function Variables(t, x) {
            var n = new Node(t);
            
            //Destructuring assignments
            if (t.match(jsdef.LEFT_BRACKET)) {
                var n2 = new Node(t, jsdef.ARRAY_INIT), vartype = "";
                while ((tt = t.peek()) != jsdef.RIGHT_BRACKET) {
                    if (tt == jsdef.COMMA) {
                        t.get();
                        
                        emptyEl = new Node(t, jsdef.VOID);
                        emptyEl[0] = new Node(t, jsdef.NUMBER);
                        emptyEl[0].value = 0;
                        n2.push(emptyEl);
                        
                        continue;
                    }
                    if (t.match(jsdef.IDENTIFIER)) {
                    	n2.push(new Node(t));
                    }
                    else {
	                    throw t.newSyntaxError("Invalid variable initialization");
                    }
                    if (!t.match(jsdef.COMMA))
                        break;
                }
                t.mustMatch(jsdef.RIGHT_BRACKET);
                
        		if (t.match(jsdef.AS)) {
		        	if (t.token().assignOp)
		                throw t.newSyntaxError("Invalid variable initialization");
		            t.mustMatch(jsdef.IDENTIFIER);
		            vartype = t.token().value;
		            if (t.match(jsdef.LEFT_BRACKET)) {
		            	t.mustMatch(jsdef.RIGHT_BRACKET);
		            	n2.vartype = vartype + "[]";
		            }else {
			            n2.vartype = new Node(t).value;
			            
			            //Convert StringArray to String[], NumberArray to
			            //Number[], etc.
			            n2.vartype = ~ArrayTypes.indexOf(n2.vartype) ?
							n2.vartype.replace(/Array$/, "[]") :
							n2.vartype;
			        }
			        
			        if (t.match(jsdef.NOT)) n2.vartype += "!";
				}
                
                if (t.match(jsdef.ASSIGN)) {
	                if (t.token().assignOp)
	                    throw t.newSyntaxError("Invalid variable initialization");
	                n2.initializer = Expression(t, x, jsdef.COMMA);
	            }
	            
	            n.push(n2);
	            x.varDecls.push(n2);
	            //t.scanOperand = false;
            }
            //Regular variable declarations
            else {
		        do {
		            n.public = t.public;
		            n.private = t.private;
		            n.protected = t.protected;
		            n.static = t.static;

			        t.mustMatch(jsdef.IDENTIFIER);
			        var n2 = new Node(t), vartype = "";
			        n2.name = n2.value;
			        if (t.match(jsdef.AS)) {
			        	if (t.token().assignOp)
			                throw t.newSyntaxError("Invalid variable initialization");
			            t.mustMatch(jsdef.IDENTIFIER);
			            vartype = t.token().value;
			            if (t.match(jsdef.LEFT_BRACKET)) {
			            	t.mustMatch(jsdef.RIGHT_BRACKET);
			            	n2.vartype = vartype + "[]";
			            }
			            else {
				            n2.vartype = new Node(t).value;
				            
				            //Convert StringArray to String[], NumberArray to
				            //Number[], etc.
				            n2.vartype = ~ArrayTypes.indexOf(n2.vartype) ?
								n2.vartype.replace(/Array$/, "[]") :
								n2.vartype;
				        }
				        
				        if (t.match(jsdef.NOT)) n2.vartype += "!";
					}
			        if (t.match(jsdef.ASSIGN)) {
			            if (t.token().assignOp)
			                throw t.newSyntaxError("Invalid variable initialization");
			            n2.initializer = Expression(t, x, jsdef.COMMA);
			        }
		            n2.readOnly = (n.type == jsdef.CONST);

		            n.push(n2);
		            x.varDecls.push(n);
		        } while (t.match(jsdef.COMMA));
            }
            return n;
        }

        function ParenExpression(t, x) {
            t.mustMatch(jsdef.LEFT_PAREN);
            var n = Expression(t, x);
            t.mustMatch(jsdef.RIGHT_PAREN);
            return n;
        }

        var opPrecedence = {
            SEMICOLON: 0,
            COMMA: 1, TYPESYS: 1,
            ASSIGN: 2, HOOK: 2, COLON: 2,
            // The above all have to have the same precedence, see bug 330975.
            OR: 4,
            AND: 5,
            BITWISE_OR: 6,
            BITWISE_XOR: 7,
            BITWISE_AND: 8,
            EQ: 9, NE: 9, STRICT_EQ: 9, STRICT_NE: 9,
            LT: 10, LE: 10, GE: 10, GT: 10, IN: 10, INSIDE: 10, INSTANCEOF: 10, IS: 10,
            LSH: 11, RSH: 11, URSH: 11,
            PLUS: 12, MINUS: 12,
            MUL: 13, DIV: 13, MOD: 13, REGEXP_MATCH: 13,
            DELETE: 14, VOID: 14, TYPEOF: 14, // PRE_INCREMENT: 14, PRE_DECREMENT: 14,
            NOT: 14, BITWISE_NOT: 14, UNARY_PLUS: 14, UNARY_MINUS: 14, UNARY_EXISTS: 14, 
            RANGE: 14, EXPONENT: 14,
            INCREMENT: 15, DECREMENT: 15,     // postfix
            PUBLIC: 16, PRIVATE: 16, PROTECTED: 16, STATIC: 16,
            NEW: 17,
            DOT: 18
        };

        // Map operator type code to precedence.
        for (var i in opPrecedence)
            if (jsdef[i]) opPrecedence[jsdef[i]] = opPrecedence[i];

        var opArity = {
            COMMA: -2,
            ASSIGN: 2,
            HOOK: 3,
            OR: 2,
            AND: 2,
            BITWISE_OR: 2,
            BITWISE_XOR: 2,
            BITWISE_AND: 2,
            EQ: 2, NE: 2, STRICT_EQ: 2, STRICT_NE: 2,
            LT: 2, LE: 2, GE: 2, GT: 2, IN: 2, INSIDE: 2, INSTANCEOF: 2, IS: 2,
            LSH: 2, RSH: 2, URSH: 2,
            PLUS: 2, MINUS: 2,
            MUL: 2, DIV: 2, MOD: 2,
            EXPONENT: 2,
            DELETE: 1, VOID: 1, TYPEOF: 1, TYPESYS: 1, // PRE_INCREMENT: 1, PRE_DECREMENT: 1,
            NOT: 1, BITWISE_NOT: 1, UNARY_PLUS: 1, UNARY_MINUS: 1, UNARY_EXISTS: 1,
            INCREMENT: 1, DECREMENT: 1,     // postfix
            NEW: 1, NEW_WITH_ARGS: 2, DOT: 2, INDEX: 2, CALL: 2,
            ARRAY_INIT: 1, OBJECT_INIT: 1, GROUP: 1,
            REGEXP_MATCH: 1, RANGE: 2,
            PUBLIC: 1, PRIVATE: 1, PROTECTED: 1, STATIC: 1
        };

        // Map operator type code to arity.
        for (var i in opArity)
            if (jsdef[i]) opArity[jsdef[i]] = opArity[i];

        function Expression(t, x, stop) {
            var n, id, tt, operators = [], operands = [];
            var bl = x.bracketLevel, cl = x.curlyLevel, pl = x.parenLevel,
            hl = x.hookLevel;

            function reduce() {
                var n = operators.pop();
                var op = n.type;
                var arity = opArity[op];
                if (arity == -2) {
                    // Flatten left-associative trees.
                    var left = operands.length >= 2 && operands[operands.length-2];
                    if (left.type == op) {
                        var right = operands.pop();
                        left.push(right);
                        return left;
                    }
                    arity = 2;
                }

                // Always use push to add operands to n, to update start and end.
                var a = operands.splice(operands.length - arity, arity);
                for (var i = 0; i < arity; i++)
                    n.push(a[i]);

                // Include closing bracket or postfix operator in [start,end).
                if (n.end < t.token().end)
                    n.end = t.token().end;

                operands.push(n);
                return n;
            }

            loop:
            while ((tt = t.get()) != jsdef.END) {
                if (tt == stop &&
                    x.bracketLevel == bl && x.curlyLevel == cl && x.parenLevel == pl &&
                    x.hookLevel == hl) {
                    // Stop only if tt matches the optional stop parameter, and that
                    // token is not quoted by some kind of bracket.
                    break;
                }
                switch (tt) {
                case jsdef.SEMICOLON:
                    // NB: cannot be empty, Statement handled that.
                    break loop;

                case jsdef.ASSIGN:
                case jsdef.HOOK:
                case jsdef.COLON:
                    if (t.scanOperand)
                        break loop;
                    // Use >, not >=, for right-associative jsdef.ASSIGN and jsdef.HOOK/jsdef.COLON.
                    while (opPrecedence[operators.top().type] > opPrecedence[tt] ||
                           (tt == jsdef.COLON && operators.top().type == jsdef.ASSIGN)) {
                        reduce();
                    }
                    if (tt == jsdef.COLON) {
                        n = operators.top();
                        if (n.type != jsdef.HOOK)
                            throw t.newSyntaxError("Invalid label");
                        --x.hookLevel;
                    } else {
                        operators.push(new Node(t));
                        if (tt == jsdef.ASSIGN)
                            operands.top().assignOp = t.token().assignOp;
                        else
                            ++x.hookLevel;      // tt == jsdef.HOOK
                    }
                    t.scanOperand = true;
                    break;

                case jsdef.IN:
                case jsdef.INSIDE:
                    // An in operator should not be parsed if we're parsing the head of
                    // a for (...) loop, unless it is in the then part of a conditional
                    // expression, or parenthesized somehow.
                    if (x.inForLoopInit && !x.hookLevel &&
                        !x.bracketLevel && !x.curlyLevel && !x.parenLevel) {
                        break loop;
                    }
                    // FALL THROUGH
                case jsdef.COMMA:
                    // Treat comma as left-associative so reduce can fold left-heavy
                    // jsdef.COMMA trees into a single array.
                    // FALL THROUGH
                case jsdef.OR:
                case jsdef.AND:
                case jsdef.BITWISE_OR:
                case jsdef.BITWISE_XOR:
                case jsdef.BITWISE_AND:
                case jsdef.EQ: case jsdef.NE: case jsdef.STRICT_EQ: case jsdef.STRICT_NE:
                case jsdef.LT: case jsdef.LE: case jsdef.GE: case jsdef.GT:
                case jsdef.INSTANCEOF: case jsdef.IS:
                case jsdef.LSH: case jsdef.RSH: case jsdef.URSH:
                case jsdef.PLUS: case jsdef.MINUS:
                case jsdef.MUL: case jsdef.DIV: case jsdef.MOD:
                case jsdef.EXPONENT:
                case jsdef.DOT:
                case jsdef.RANGE:
                    if (t.scanOperand)
                        break loop;
                    while (opPrecedence[operators.top().type] >= opPrecedence[tt])
                        reduce();
                    if (tt == jsdef.RANGE && !x.inArrayInit) {
                    	throw t.newSyntaxError("Invalid ... operator");
                    }
                    if (tt == jsdef.DOT) {
                        t.mustMatch(jsdef.IDENTIFIER);
                        operands.push(new Node(t, jsdef.DOT, operands.pop(), new Node(t)));
                    } else {
                        operators.push(new Node(t));
                        t.scanOperand = true;
                    }
                    break;

                case jsdef.DELETE: case jsdef.VOID: case jsdef.TYPEOF: case jsdef.TYPESYS:
                case jsdef.NOT: case jsdef.BITWISE_NOT: case jsdef.UNARY_PLUS: case jsdef.UNARY_MINUS:
                case jsdef.NEW: case jsdef.REGEXP_MATCH: case jsdef.UNARY_EXISTS:
                    if (!t.scanOperand)
                        break loop;
                    operators.push(new Node(t));
                    break;

                case jsdef.INCREMENT: case jsdef.DECREMENT:
                    if (t.scanOperand) {
                        operators.push(new Node(t));  // prefix increment or decrement
                    } else {
                        // Don't cross a line boundary for postfix {in,de}crement.
                        if (t.tokens[(t.tokenIndex + t.lookahead - 1) & 3].lineno !=
                            t.lineno) {
                            break loop;
                        }

                        // Use >, not >=, so postfix has higher precedence than prefix.
                        while (opPrecedence[operators.top().type] > opPrecedence[tt])
                            reduce();
                        n = new Node(t, tt, operands.pop());
                        n.postfix = true;
                        operands.push(n);
                    }
                    break;

                case jsdef.FUNCTION:
                    if (!t.scanOperand)
                        break loop;
                    operands.push(FunctionDefinition(t, x, false, EXPRESSED_FORM));
                    t.scanOperand = false;
                    break;
                    
                case jsdef.CLASS:
                    if (!t.scanOperand)
                        break loop;
                    operands.push(ClassDefinition(t, x, false, EXPRESSED_FORM));
                    t.scanOperand = false;
                    break;

                case jsdef.NULL: case jsdef.THIS: case jsdef.TRUE: case jsdef.FALSE:
                case jsdef.IDENTIFIER: case jsdef.NUMBER: case jsdef.STRING: case jsdef.REGEXP:
                    if (!t.scanOperand)
                        break loop;
                    operands.push(new Node(t));
                    t.scanOperand = false;
                    break;
                    
                //"return" as an expression for expression closures
                //e.g. [1,2,3].map(function() return 1 + 1)
                case jsdef.RETURN:
		            if (!x.inFunction || !t.expClosure)
		                throw t.newSyntaxError("Invalid return");
		            n = new Node(t);
		            tt = t.peekOnSameLine();
		            if (tt != jsdef.END && tt != jsdef.NEWLINE && tt != jsdef.SEMICOLON && tt != jsdef.RIGHT_CURLY)
		                n.value = Expression(t, x);
		            operands.push(n);
		            t.scanOperand = false;
		            break;

                case jsdef.LEFT_BRACKET:
                    if (t.scanOperand) {
                        // Array initialiser.  Parse using recursive descent, as the
                        // sub-grammar here is not an operator grammar.
                        n = new Node(t, jsdef.ARRAY_INIT);
                        x.inArrayInit = true;
                        var counter = 0, n2, emptyEl;
                        while ((tt = t.peek()) != jsdef.RIGHT_BRACKET) {
                        	counter++;
                            if (tt == jsdef.COMMA) {
                                t.get();
                                //n.push(null); //Removed from Narcissus as it won't parse [a,,b]
                                
                                //Parse empty elements [,,,] as void 0
                                emptyEl = new Node(t, jsdef.VOID);
                                emptyEl[0] = new Node(t, jsdef.NUMBER);
                                emptyEl[0].value = 0;
                                n.push(emptyEl);
                                
                                continue;
                            }
                            n.push(Expression(t, x, jsdef.COMMA));
                            
                            //Array comprehensions
                            if (counter == 1 && t.peek() == jsdef.FOR) {
                            	n.type = jsdef.ARRAY_COMP;
                            	
                            	n2 = new Node(t);
	                            t.mustMatch(jsdef.FOR);
    	                        t.mustMatch(jsdef.LEFT_PAREN);
    	                        
    	                        if (t.match(jsdef.VAR) || t.match(jsdef.LET)) {
    	                        	x.inForLoopInit = true;
    	                        	n2.iterator = Variables(t, x);
    	                        	x.inForLoopInit = false;
    	                        }
    	                        else if (t.match(jsdef.IDENTIFIER)) {
    	                        	x.inForLoopInit = true;
    	                        	t.unget();
    	                        	n2.iterator = Expression(t, x);
    	                        	x.inForLoopInit = false;
    	                        }
    	                        else {
	    	                        throw t.newSyntaxError("Missing ] after element list");
    	                        }
    	                        
    	                        if (t.match(jsdef.IN)) {
    	                        	n2.type = jsdef.FOR_IN;
    	                        	n2.object = Expression(t, x);
    	                        }
    	                        else if (t.match(jsdef.INSIDE)) {
    	                        	n2.type = jsdef.FOR_INSIDE;
    	                        	n2.object = Expression(t, x);
    	                        }
    	                        else {
	    	                        throw t.newSyntaxError("Missing ] after element list");
    	                        }
    	                        t.mustMatch(jsdef.RIGHT_PAREN);
    	                        n.push(n2);
    	                        
    	                        while (t.peek() != jsdef.RIGHT_BRACKET) {
    	                        	n2 = new Node(t);
    	                        	
    	                        	if (t.match(jsdef.IF)) {
    	                        		n2.type = jsdef.IF;
    	                        		
    	                        		t.mustMatch(jsdef.LEFT_PAREN);
    	                        		n2.condition = Expression(t, x);
    	                        		t.mustMatch(jsdef.RIGHT_PAREN);
    	                        	}
    	                        	else if (t.match(jsdef.FOR)) {
		    	                        t.mustMatch(jsdef.LEFT_PAREN);
    	                        
					                    if (t.match(jsdef.VAR) || t.match(jsdef.LET)) {
					                    	x.inForLoopInit = true;
					                    	n2.iterator = Variables(t, x);
					                    	x.inForLoopInit = false;
					                    }
					                    else if (t.match(jsdef.IDENTIFIER)) {
					                    	x.inForLoopInit = true;
					                    	t.unget();
					                    	n2.iterator = Expression(t, x);
					                    	x.inForLoopInit = false;
					                    }
					                    else {
						                    throw t.newSyntaxError("Missing ] after element list");
					                    }
					                    
					                    if (t.match(jsdef.IN)) {
					                    	n2.type = jsdef.FOR_IN;
					                    	n2.object = Expression(t, x);
					                    }
					                    else if (t.match(jsdef.INSIDE)) {
					                    	n2.type = jsdef.FOR_INSIDE;
					                    	n2.object = Expression(t, x);
					                    }
					                    else {
						                    throw t.newSyntaxError("Missing ] after element list");
					                    }
					                    
					                    t.mustMatch(jsdef.RIGHT_PAREN);
    	                        	}
    	                        	else {
    	                        		throw t.newSyntaxError("Missing ] after element list");
    	                        	}
    	                        	
    	                        	n.push(n2);
    	                        }
    	                        
                            	break;
                            }
                            
                            if (!t.match(jsdef.COMMA))
                                break;
                        }
                        t.mustMatch(jsdef.RIGHT_BRACKET);
                        operands.push(n);
                        x.inArrayInit = false;
                        t.scanOperand = false;
                    } else {
                        // Property indexing operator.
                        operators.push(new Node(t, jsdef.INDEX));
                        t.scanOperand = true;
                        ++x.bracketLevel;
                    }
                    break;

                case jsdef.RIGHT_BRACKET:
                    if (t.scanOperand || x.bracketLevel == bl)
                        break loop;
                    while (reduce().type != jsdef.INDEX)
                        continue;
                    --x.bracketLevel;
                    break;

                case jsdef.LEFT_CURLY:
                    if (!t.scanOperand)
                        break loop;
                    // Object initialiser.  As for array initialisers (see above),
                    // parse using recursive descent.
                    ++x.curlyLevel;
                    n = new Node(t, jsdef.OBJECT_INIT);
                    object_init:
                    if (!t.match(jsdef.RIGHT_CURLY)) {
                        do {
                            tt = t.get();
                            if ((t.token().value == "get" || t.token().value == "set") &&
                                t.peek() == jsdef.IDENTIFIER) {
                                if (x.ecmaStrictMode)
                                    throw t.newSyntaxError("Illegal property accessor");
                                n.push(FunctionDefinition(t, x, true, EXPRESSED_FORM));
                            }
                            else {
                                switch (tt) {
                                case jsdef.IDENTIFIER:
                                case jsdef.NUMBER:
                                case jsdef.STRING:
                                    id = new Node(t);
                                    break;
                                case jsdef.RIGHT_CURLY:
                                    if (x.ecmaStrictMode)
                                        throw t.newSyntaxError("Illegal trailing ,");
                                    break object_init;
                                default:
                                    throw t.newSyntaxError("Invalid property name");
                                }
                                t.mustMatch(jsdef.COLON);
                                n.push(new Node(t, jsdef.PROPERTY_INIT, id,
                                                Expression(t, x, jsdef.COMMA)));
                            }
                        } while (t.match(jsdef.COMMA));
                        t.mustMatch(jsdef.RIGHT_CURLY);
                    }
                    operands.push(n);
                    t.scanOperand = false;
                    --x.curlyLevel;
                    break;

                case jsdef.RIGHT_CURLY:
                    if (!t.scanOperand && x.curlyLevel != cl)
                        throw "PANIC: right curly botch";
                    break loop;

                case jsdef.LEFT_PAREN:
                    if (t.scanOperand) {
                        operators.push(new Node(t, jsdef.GROUP));
                    } else {
                        while (opPrecedence[operators.top().type] > opPrecedence[jsdef.NEW])
                            reduce();

                        // Handle () now, to regularize the n-ary case for n > 0.
                        // We must set scanOperand in case there are arguments and
                        // the first one is a regexp or unary+/-.
                        n = operators.top();
                        t.scanOperand = true;
                        if (t.match(jsdef.RIGHT_PAREN)) {
	                        if (n.type == jsdef.NEW) {
	                            --operators.length;
	                            n.push(operands.pop());
	                        }
	                        else if(n.type == jsdef.IDENTIFIER) {
	                        	--operators.length;
	                        } else {
	                            n = new Node(t, jsdef.CALL, operands.pop(),
	                                         new Node(t, jsdef.LIST));
	                        }
	                        operands.push(n);
	                        t.scanOperand = false;
	                        break;
                        }
                        if (n.type == jsdef.NEW)
                            n.type = jsdef.NEW_WITH_ARGS;
                        else
                            operators.push(new Node(t, jsdef.CALL));
                    }
                    ++x.parenLevel;
                    break;

                case jsdef.RIGHT_PAREN:
                    if (t.scanOperand || x.parenLevel == pl)
                        break loop;
                    while ((tt = reduce().type) != jsdef.GROUP && tt != jsdef.CALL &&
                           tt != jsdef.NEW_WITH_ARGS) {
                        continue;
                    }
                    if (tt != jsdef.GROUP) {
                        n = operands.top();
                        if (n[1].type != jsdef.COMMA)
                            n[1] = new Node(t, jsdef.LIST, n[1]);
                        else
                            n[1].type = jsdef.LIST;
                    }
                    --x.parenLevel;
                    break;

                    // Automatic semicolon insertion means we may scan across a newline
                    // and into the beginning of another statement.  If so, break out of
                    // the while loop and let the t.scanOperand logic handle errors.
                default:
                    break loop;
                }
            }

            if (x.hookLevel != hl)
                throw t.newSyntaxError("Missing : after ?");
            if (x.parenLevel != pl)
                throw t.newSyntaxError("Missing ) in parenthetical");
            if (x.bracketLevel != bl)
                throw t.newSyntaxError("Missing ] in index expression");
            if (t.scanOperand)
                throw t.newSyntaxError("Missing operand");

            // Resume default mode, scanning for operands, not operators.
            t.scanOperand = true;
            t.unget();
            while (operators.length)
                reduce();
            return operands.pop();
        }

        function jsparse(s, f, l) {
            var t = new Tokenizer(s, f, l);
            var x = new CompilerContext(false);
            var n = Script(t, x);
            if (!t.done())
                throw t.newSyntaxError("Syntax error");
            return n;
        }

        jsparse.MISSING_FUNCTION_IDENTIFIER = "Missing function identifier";

        return jsparse;

        })();
    
    };
    _install();
})(this);
//Typed ES3
//Copyright (C) 2011 by Roger Poon

//This does not conform *exactly* with ES3 - only where practical
//e.g. we do not *practically* need a [[Call]] property
//Please do not send pull requests just for the sake of conforming to the specification

//This is a typed ES3.  We use non-standard internal properties such as [[Type]]

//This code may be extremely unorganized and certain declarations may appear out
//of order, but it needs to stay that way due to all the circular references in ES3

function CreateGlobal(node) {

	//Create extendable base ES3-compatible object
	//"Every built-in prototype object has the Object prototype object, which is
	// the initial value of the expression Object.prototype (15.2.3.1), as the 
	// value of its internal [[Prototype]] property, except the Object prototype
	// object itself."
	var obj = {
		"[[Class]]": "Object",
		"[[Prototype]]": null,
		
		"[[DontEnum]]": true,
		
		"[[Type]]": "Object",
		
		properties: {
			toString: CreateFunction("String"),
			toLocaleString: CreateFunction("String"),
			valueOf: CreateFunction("*"),
			hasOwnProperty: CreateFunction("Boolean", "String"),
			isPrototypeOf: CreateFunction("Boolean", "Object"),
			propertyIsEnumerable: CreateFunction("Boolean", "String")
		}
	};
	function CreateObject() {
		return obj;
	}
	var objPro = CreateObject();
	
	//Create extendable base ES3-compatible function
	//"Every built-in function and every built-in constructor has the Function 
	// prototype object, which is the initial value of the expression 
	// Function.prototype (15.3.2.1), as the value of its internal [[Prototype]] 
	// property."
	//
	//First argument: return type
	//Subsequent arguments: type of each parameter ("*" for any type)
	//	Rest parameters can be used: CreateFunction("String", "String", "...*");
	function CreateFunction() {
		var returnType = arguments[0];
		arguments = Array.prototype.slice.call(arguments, 1);
		
		var fun = {
			"[[Class]]": "Function",
			"[[Type]]": "Function", //Non-standard
			"[[Prototype]]": fn_proto,
			
			"[[DontEnum]]": true,
			
			type: jsdef.FUNCTION,
			returntype: returnType,
			
			properties: {				
				prototype: {
					"[[Class]]": "Function",
					"[[Type]]": "Function",
					"[[Prototype]]": objPro,
				
					"[[DontEnum]]": true,
					"[[DontDelete]]": true,
					"[[ReadOnly]]": true,
				
					type: jsdef.FUNCTION,
					returntype: "undefined",
					
					properties: {			
						toString: fn_toString,
						apply: fn_apply,
						call: fn_call,
						length: {
							"[[DontEnum]]": true,
							"[[DontDelete]]": true,
							"[[ReadOnly]]": true,
				
							"[[Type]]": "Number"
						}
					}
				},
			
				length: {
					value: arguments.length >>> 0,
				
					"[[DontEnum]]": true,
					"[[DontDelete]]": true,
					"[[ReadOnly]]": true,
				
					"[[Type]]": "Number"
				}
			}
		};
		
		fun.properties.prototype.properties.constructor = {
			"[[Type]]": "Function",
			
			type: jsdef.FUNCTION,
			returntype: "Function",
			
			properties: {
				length: {
					"[[DontEnum]]": true,
					"[[DontDelete]]": true,
					"[[ReadOnly]]": true,
				
					"[[Type]]": "Number"
				}
			}
		};
		fun.properties.prototype.properties.constructor.properties.prototype =
			fun.properties.prototype;
		
		for (var i=0, len=arguments.length; i<len; i++) {
			fun[i] = {
				"[[Type]]": arguments[i] //Non-standard
			};
		}
		
		return fun;
	}
	var fn_proto = CreateFunction("undefined"),
		fn_toString = CreateFunction("String"),
		fn_apply = CreateFunction("*", "Object", "Array!"),
		fn_call = CreateFunction("*", "Object", "...*!");
	fn_apply.apply = fn_call.apply = fn_proto.apply = fn_apply;
	fn_apply.call = fn_call.call = fn_proto.call = fn_call;
	
	var _Object = extend(CreateFunction("Object", "*"), {
		identifier: "Object",
		value: {},
	
		"[[Class]]": "Object",
		"[[DontDelete]]": false
	});
	_Object.properties.prototype = {
		"[[Prototype]]": null,
		
		properties: {
			constructor: _Object,
			toString: fn_toString,
			toLocaleString: CreateFunction("String"),
			valueOf: CreateFunction("*"), //TODO: wrong?
			hasOwnProperty: CreateFunction("Boolean", "String"),
			isPrototypeOf: CreateFunction("Boolean", "Object"),
			propertyIsEnumerable: CreateFunction("Boolean", "String")
		}
	};
	obj.properties.constructor = _Object; //Object prototype object's constructor is Object constructor
	fn_proto["[[Prototype]]"] = CreateObject();
	
	//Extend object
	function extend(a, b) {
		var c = {};
		
		for (var i in a) {
			c[i] = a[i];
		}
		
		for (var j in b) {
			c[j] = b[j];
		}
		
		return c;
	}
	
	////////////////////////////////////////////////////////////////////////////

	//ES3 15.1.1: Value Properties of the Global Object
	node.Variables.push({
		identifier: "NaN",
		value: "a" / 2,
	
		"[[DontEnum]]": true,
		"[[DontDelete]]": true,
		"[[Type]]": "Number"
	});
	node.Variables.push({
		identifier: "Infinity",
		value: 1 / 0,
	
		"[[DontEnum]]": true,
		"[[DontDelete]]": true,
		"[[Type]]": "Number"
	});
	node.Variables.push({
		identifier: "undefined",
		value: void 0,
	
		"[[DontEnum]]": true,
		"[[DontDelete]]": true
	});
	//ES3 15.1.2: Function Properties of the Global Object
	node.Variables.push(extend(CreateFunction("*", "*"), {
		identifier: "eval",
		value: eval
	}));
	node.Variables.push(extend(CreateFunction("Number", "String", "Number"), {
		identifier: "parseInt",
		value: parseInt
	}));
	node.Variables.push(extend(CreateFunction("Number", "String"), {
		identifier: "parseFloat",
		value: parseFloat
	}));
	node.Variables.push(extend(CreateFunction("Boolean", "Number"), {
		identifier: "isNaN",
		value: isNaN
	}));
	node.Variables.push(extend(CreateFunction("Boolean", "Number"), {
		identifier: "isFinite",
		value: isFinite
	}));
	//ES3 15.1.3: URI Handling Function Properties
	node.Variables.push(extend(CreateFunction("String", "String"), {
		identifier: "decodeURI",
		value: decodeURI
	}));
	node.Variables.push(extend(CreateFunction("String", "String"), {
		identifier: "decodeURIComponent",
		value: decodeURIComponent
	}));
	node.Variables.push(extend(CreateFunction("String", "String"), {
		identifier: "encodeURI",
		value: encodeURI
	}));
	node.Variables.push(extend(CreateFunction("String", "String"), {
		identifier: "encodeURIComponent",
		value: encodeURIComponent
	}));
	
	//ES3 15.2: Object Objects
	node.Variables.push(_Object);
	
	//ES3 15.3: Function Objects
	var _Function;
	node.Variables.push(_Function = extend(CreateFunction("Function", "*"), {
		identifier: "Function",
		value: function(){},
	
		"[[DontDelete]]": false
	}));
	//TODO: 15.3.5 Properties of Function Instances
	
	//ES3 15.4: Array Objects
	var _Array = extend(CreateFunction("Array", "*"), {
		identifier: "Array",
		value: [],
	
		"[[DontDelete]]": false
	});
	_Array.properties.prototype = {
		"[[Prototype]]": obj,
		"[[Type]]": "Object",
		
		properties: {
			constructor: _Array,
			toString: fn_toString,
			toLocaleString: CreateFunction("String"),
			concat: CreateFunction("Array", "...Array"),
			join: CreateFunction("String", "String!"),
			pop: CreateFunction("*"),
			push: CreateFunction("Number", "...*"),
			reverse: CreateFunction("Array"),
			shift: CreateFunction("*"),
			slice: CreateFunction("Array", "Number!", "Number!"),
			sort: CreateFunction("Array", "Function!"),
			splice: CreateFunction("Array", "Number", "Number", "...*"),
			unshift: CreateFunction("Number", "*")
		}
	};
	node.Variables.push(_Array);
	//TODO: 15.4.5 Properties of Array Instances
	
	//ES3 15.5: String Objects
	var _String = extend(CreateFunction("String", "*"), {
		identifier: "String",
		value: "",
	
		"[[DontDelete]]": false
	});
	_String.properties = extend(_String.properties, {
		fromCharCode: CreateFunction("String", "Number", "...Number")
	});
	_String.properties.prototype = {
		"[[Prototype]]": obj,
		"[[Type]]": "Object",
		
		//TODO: all methods that return "Array" should be overloaded to return
		//		"StringArray"
		properties: {
			constructor: _String,
			toString: fn_toString,
			valueOf: CreateFunction("String"),
			charAt: CreateFunction("String", "Number"),
			charCodeAt: CreateFunction("Number", "Number"),
			concat: CreateFunction("String", "...String"),
			indexOf: CreateFunction("Number", "String", "Number"),
			lastIndexOf: CreateFunction("Number", "String", "Number"),
			localeCompare: CreateFunction("Number", "String"),
			match: CreateFunction("Array!", "RegExp"),
			replace: CreateFunction("String", "RegExp", "Function"), //TODO: overload this func: CreateFunction("String", "RegExp", "String")
			search: CreateFunction("Number", "RegExp"),
			slice: CreateFunction("String", "Number!", "Number!"),
			split: CreateFunction("Array", "String!", "Number!"), //TODO: overload this func: CreateFunction("Array", "RegExp", "Number!")
			substring: CreateFunction("String", "Number", "Number!"),
			toLowerCase: CreateFunction("String"),
			toLocaleLowerCase: CreateFunction("String"),
			toUpperCase: CreateFunction("String"),
			toLocaleUpperCase: CreateFunction("String")
		}
	};
	node.Variables.push(_String);
	//TODO: 15.5.5 Properties of String Instances
	
	//ES3 15.6: Boolean Objects
	var _Boolean = extend(CreateFunction("Boolean", "*"), {
		identifier: "Boolean",
		value: false,
	
		"[[DontDelete]]": false
	});
	_Boolean.properties.prototype = {
		"[[Prototype]]": obj,
		"[[Type]]": "Object",
		
		properties: {
			constructor: _Boolean,
			toString: fn_toString,
			valueOf: CreateFunction("Boolean")
		}
	};
	node.Variables.push(_Boolean);
	
	//ES3 15.7: Number Objects
	var _Number = extend(CreateFunction("Number", "*"), {
		identifier: "Number",
		value: 0,
	
		"[[DontDelete]]": false
	});
	_Number.properties.prototype = {
		"[[Prototype]]": obj,
		"[[Type]]": "Object",
		
		properties: {
			constructor: _Number,
			toString: fn_toString,
			toLocaleString: CreateFunction("String"),
			valueOf: CreateFunction("Number"),
			toFixed: CreateFunction("String", "Number"),
			toExponential: CreateFunction("String", "Number"),
			toPrecision: CreateFunction("String", "Number")
		}
	};
	_Number.properties = extend(_Number.properties, {
		MAX_VALUE: {
			"[[Type]]": "Number",
			"[[Prototype]]": obj,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		MIN_VALUE: {
			"[[Type]]": "Number",
			"[[Prototype]]": obj,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		NaN: {
			"[[Type]]": "Number",
			"[[Prototype]]": obj,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		NEGATIVE_INFINITY: {
			"[[Type]]": "Number",
			"[[Prototype]]": obj,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		POSITIVE_INFINITY: {
			"[[Type]]": "Number",
			"[[Prototype]]": obj,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		}
	});
	node.Variables.push(_Number);
	
	//ES3 15.8: The Math Object
	var _Math = extend(CreateObject(), {
		identifier: "Math",
		
		"[[Prototype]]": obj
	});
	var _MathCtor = _Math.properties.constructor;
	_Math.properties = {
		constructor: _MathCtor,
		
		E: {
			"[[Type]]": "Number",
			"[[Prototype]]": _Number.properties.prototype,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		LN10: {
			"[[Type]]": "Number",
			"[[Prototype]]": _Number.properties.prototype,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		LN2: {
			"[[Type]]": "Number",
			"[[Prototype]]": _Number.properties.prototype,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		LOG2E: {
			"[[Type]]": "Number",
			"[[Prototype]]": _Number.properties.prototype,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		LOG10E: {
			"[[Type]]": "Number",
			"[[Prototype]]": _Number.properties.prototype,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		PI: {
			"[[Type]]": "Number",
			"[[Prototype]]": _Number.properties.prototype,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		SQRT1_2: {
			"[[Type]]": "Number",
			"[[Prototype]]": _Number.properties.prototype,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		SQRT2: {
			"[[Type]]": "Number",
			"[[Prototype]]": _Number.properties.prototype,
			
			"[[DontEnum]]": true,
			"[[DontDelete]]": true,
			"[[ReadOnly]]": true
		},
		
		abs: CreateFunction("Number", "Number"),
		acos: CreateFunction("Number", "Number"),
		asin: CreateFunction("Number", "Number"),
		atan: CreateFunction("Number", "Number"),
		atan2: CreateFunction("Number", "Number", "Number"),
		ceil: CreateFunction("Number", "Number"),
		cos: CreateFunction("Number", "Number"),
		exp: CreateFunction("Number", "Number"),
		floor: CreateFunction("Number", "Number"),
		log: CreateFunction("Number", "Number"),
		max: CreateFunction("Number", "...Number"),
		min: CreateFunction("Number", "...Number"),
		pow: CreateFunction("Number", "Number", "Number"),
		random: CreateFunction("Number"),
		round: CreateFunction("Number", "Number"),
		sin: CreateFunction("Number", "Number"),
		sqrt: CreateFunction("Number", "Number"),
		tan: CreateFunction("Number", "Number")
	};
	node.Variables.push(_Math);
	
	//ES3 15.9: Date Objects
	var _Date = extend(CreateFunction("Date", "Number!", "Number!", "Number!",
									  "Number!", "Number!", "Number!", "Number!"), {
		identifier: "Date",
		value: 0,
	
		"[[DontDelete]]": false
	});
	_Date.properties = extend(_Date.properties, {
		parse: CreateFunction("Number", "String"),
		UTC: CreateFunction("Number", "Number", "Number", "Number!", "Number!",
							"Number!", "Number!", "Number!")
	});
	_Date.properties.prototype = {
		"[[Prototype]]": obj,
		"[[Type]]": "Object",
		
		"[[DontDelete]]": true,
		"[[DontEnum]]": true,
		"[[ReadOnly]]": true,
		
		properties: {
			constructor: _Date,
			toString: fn_toString,
			toDateString: CreateFunction("String"),
			toTimeString: CreateFunction("String"),
			toLocaleString: CreateFunction("String"),
			toLocaleDateString: CreateFunction("String"),
			toLocaleTimeString: CreateFunction("String"),
			toLocaleString: CreateFunction("String"),
			valueOf: CreateFunction("Number"),
			
			getTime: CreateFunction("Number"),
			getFullYear: CreateFunction("Number"),
			getUTCFullYear: CreateFunction("Number"),
			getMonth: CreateFunction("Number"),
			getUTCMonth: CreateFunction("Number"),
			getDate: CreateFunction("Number"),
			getUTCDate: CreateFunction("Number"),
			getDay: CreateFunction("Number"),
			getUTCDay: CreateFunction("Number"),
			getHours: CreateFunction("Number"),
			getUTCHours: CreateFunction("Number"),
			getMinutes: CreateFunction("Number"),
			getUTCMinutes: CreateFunction("Number"),
			getSeconds: CreateFunction("Number"),
			getUTCSeconds: CreateFunction("Number"),
			getMilliseconds: CreateFunction("Number"),
			getUTCMilliseconds: CreateFunction("Number"),
			getTimezoneOffset: CreateFunction("Number"),
			
			setTime: CreateFunction("Number", "Number"),
			setMilliseconds: CreateFunction("Number", "Number"),
			setUTCMilliseconds: CreateFunction("Number", "Number"),
			setSeconds: CreateFunction("Number", "Number", "Number!"),
			setUTCSeconds: CreateFunction("Number", "Number", "Number!"),
			setMinutes: CreateFunction("Number", "Number", "Number!", "Number!"),
			setUTCMinutes: CreateFunction("Number", "Number", "Number!", "Number!"),
			setHours: CreateFunction("Number", "Number", "Number!", "Number!", "Number!"),
			setUTCHours: CreateFunction("Number", "Number", "Number!", "Number!", "Number!"),
			setDate: CreateFunction("Number", "Number"),
			setUTCDate: CreateFunction("Number", "Number"),
			setMonth: CreateFunction("Number", "Number", "Number!"),
			setUTCMonth: CreateFunction("Number", "Number", "Number!"),
			setFullYear: CreateFunction("Number", "Number", "Number!", "Number!"),
			setUTCFullYear: CreateFunction("Number", "Number", "Number!", "Number!"),
			
			toUTCString: CreateFunction("String"),
		}
	};
	node.Variables.push(_Date);
	
	//ES3 15.10: RegExp (Regular Expression) Objects
	var _RegExp = extend(CreateFunction("RegExp", "*", "String!"), {
		identifier: "RegExp",
		value: 0,
	
		"[[DontDelete]]": false
	});
	_RegExp.properties.prototype = {
		"[[Prototype]]": obj,
		"[[Type]]": "Object",
		
		"[[DontDelete]]": true,
		"[[DontEnum]]": true,
		"[[ReadOnly]]": true,
		
		properties: {
			constructor: _RegExp,
			exec: CreateFunction("Array!", "String"),
			test: CreateFunction("Boolean", "String"),
			toString: fn_toString
		}
	};
	node.Variables.push(_RegExp);
	//TODO: 15.10.7 Properties of RegExp Instances
	
	//ES3 15.11: Error Objects
	var _Error = extend(CreateFunction("Error", "String!"), {
		identifier: "Error",
	
		"[[DontDelete]]": false
	});
	_Error.properties.prototype = {
		"[[Prototype]]": obj,
		"[[Type]]": "Object",
		
		"[[DontDelete]]": true,
		"[[DontEnum]]": true,
		"[[ReadOnly]]": true,
		
		properties: {
			constructor: _Error,
			name: {
				"[[Type]]": "String",
				"[[Prototype]]": _String.properties.prototype
			},
			message: {
				"[[Type]]": "String",
				"[[Prototype]]": _String.properties.prototype
			},
			toString: fn_toString
		}
	};
	node.Variables.push(_Error);
	
	var _EvalError, _RangeError, _ReferenceError, _SyntaxError, _TypeError, _URIError;
	
	node.Variables.push(_EvalError = extend(_Error, {
		identifier: "EvalError"
	}));
	node.Variables.push(_RangeError = extend(_Error, {
		identifier: "RangeError"
	}));
	node.Variables.push(_ReferenceError = extend(_Error, {
		identifier: "ReferenceError"
	}));
	node.Variables.push(_SyntaxError = extend(_Error, {
		identifier: "SyntaxError"
	}));
	node.Variables.push(_TypeError = extend(_Error, {
		identifier: "TypeError"
	}));
	node.Variables.push(_URIError = extend(_Error, {
		identifier: "URIError"
	}));
	
	//ES3 Appendix B.2: Additional Properties
	node.Variables.push(extend(CreateFunction("String", "String"), {
		identifier: "escape"
	}));
	node.Variables.push(extend(CreateFunction("String", "String"), {
		identifier: "unescape"
	}));
	_String.properties.prototype.properties = extend(_String.properties.prototype.properties, {
		substr: CreateFunction("String", "Number", "Number!")
	});
	_Date.properties.prototype.properties = extend(_Date.properties.prototype.properties, {
		getYear: CreateFunction("Number"),
		setYear: CreateFunction("Number", "Number"),
		toGMTString: CreateFunction("String")
	});
	
	//Export
	CreateGlobal.Object = _Object;
	CreateGlobal.Function = _Function;
	CreateGlobal.Array = _Array;
	CreateGlobal.String = _String;
	CreateGlobal.Boolean = _Boolean;
	CreateGlobal.Number = _Number;
	CreateGlobal.Math = _Math;
	CreateGlobal.Date = _Date;
	CreateGlobal.RegExp = _RegExp;
	CreateGlobal.Error = _Error;
	CreateGlobal.EvalError = _EvalError;
	CreateGlobal.RangeError = _RangeError;
	CreateGlobal.ReferenceError = _ReferenceError;
	CreateGlobal.SyntaxError = _SyntaxError;
	CreateGlobal.TypeError = _TypeError;
	CreateGlobal.URIError = _URIError;
}
/* ***** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011 by Roger Poon
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ***** END LICENSE BLOCK ***** */

var jsdef = this.narcissus.jsdef;

function compiler(ast, options) {
	var _this = this;

	//Compiler options:
	//compiler.options = {
	//  debug: Boolean //Line #s will be same in compiled code as source code
	//  nowrap: Boolean //Don't wrap the code with (function(global){...}).call({},this)
	//  warnings: Boolean //Enable/disable warnings
	//};
	this.options = options || { debug: true, warnings: true };
	this.ast = ast;
	
	this.errors = [];
	this.warnings = [];
	this.NewWarning = function (e, node) {
		if (!this.options.warnings) return false;
		
		if (node) {
			e.line = node.lineno;
		}
		e.category = "Warning";
		e.toString = function(){ return this.message.toString() };
		
		typeof console != "undefined" && console.log(e);
		
		this.warnings.push(e);
	};
	this.NewError = function (e, node) {
		if (node) {
			e.line = node.lineno;
		}
		e.category = "Error";
		e.toString = function(){ return this.message.toString() };
		
		typeof console != "undefined" && console.log(e);
		
		this.errors.push(e);
		
		throw e;
	};
	
	this.lineno = -1; //Keep track of line numbers to compile debuggable code
	
	var VarPush = function(x) {
		for (var i=0, len=this.length; i<len; i++) {
			if (this[i].identifier === x.identifier) break;
		}
		i == len && Array.prototype.push.apply(this, Array.isArray(x) ? x : [x]);
	};
	
	//Emulate execution contexts
	this.ExecutionContexts = {};
	this.ExecutionContextsArray = [];
	this.CreateExecutionContext = function(contextId) {
		_this.ExecutionContextsArray.push(_this.ExecutionContexts[contextId] = {
			//ES3-compatible activation object
			ActivationObject:{
				"arguments":{
					value: {
						length:{
							value: 0,
							"[[DontEnum]]": true
						}
					},
					
					"[[Prototype]]": Object.prototype,					
					"[[ReadOnly]]": false,
					"[[DontDelete]]": true
				}
			},
			
			//List of all variables declared in the execution context
			Variables: [],
			
			//Internal state for next block variable identifier
			NextBlockVariable: [97],
			
			//Save scoped object extensions
			Extensions: []
		});
		
		_this.ExecutionContexts[contextId].push = VarPush;
	};
	
	this.context = null; //Current execution context
	
	this.GetContext = function(x) {
		return this.context = this.ExecutionContexts[x];
	};
	
	this.GetCurrentContext = function() {
		return this.ExecutionContextsArray[this.ExecutionContextsArray.length-1] ||
				this.ExecutionContextsArray[0];
	};
	
	this.ExitContext = function() {
		this.ExecutionContextsArray.pop();
	};

	//Scopes are NOT the same as execution contexts here due to block scope
	this.scopes = {};
	this.scopeChain = [];
	this.ScopeId = "_bScope"; //Block scope temporary variable identifier
	this.currentScope = 0;
	this.StatementBlocks = 0; //e.g. if (1) let x = 10; <-- no block { ... } present
	
	this.NewScope = function(id, node) {
		this.scopes[id] = node;
		this.scopeChain.push(node);
		this.currentScope = this.ScopeId + node.scopeId;
		
		node.Variables = [];
		node.BlockVariables = [];
		node.Functions = []; //Function declarations, not expressions
		
		node.Variables.push = node.BlockVariables.push = VarPush;
		
		/*node.Functions.push = function(x) {
			for (var i=0, len=this.length; i<len; i++) {
				if (this[i].name === x.name) break;
			}
			i == len && Array.prototype.push.apply(this, Array.isArray(x) ? x : [x]);
		};*/
		
		//Map block scoped variable identifiers
		//  oldIdentifier: newIdentifier
		node.map_BlockVars = {};
		
		//Run the TypeCheck function to notify that we've created a new scope
		this.TypeCheck(node);
		
		//If this is the global scope, push some declarations to avoid compiler warnings
		if (this.scopeChain.length == 1) {
			//Note: Include es3.js or this won't run
			if (typeof CreateGlobal == "function") {
				CreateGlobal(node);
			}
			else {
				this.NewWarning({
					type: ReferenceError,
					message: 'Compiler global header file "typed-es3.js" not found.'
				}, {lineno: -1});
			}
		}
		
		return this.scopeChain[this.scopeChain.length-1];
	};
	
	this.ExitScope = function() {
		if (typeof this.scopeChain[this.scopeChain.length-1].typesys != "undefined") {
			this.typeSystems.pop();
		}
		
		this.currentScope = this.ScopeId + this.scopeChain.pop().scopeId;
	};
	
	this.CurrentScope = function() {
		return this.scopeChain[this.scopeChain.length-1];
	};
	
	this.CurrentFunction = function(currentScopeId) {
		var currentScope;
		if (currentScope = this.scopeChain[currentScopeId] || this.scopeChain[currentScopeId]) {
			if (currentScope.isFunction) {
				return currentScope;
			}
			else if (currentScope !== _this.scopeChain[0]) {
				this.CurrentFunction(--currentScopeId);
			}
		}
		
		return null;
	};
	
	//Handle "pseudo-blocks" e.g. for (;;) let x = 10; where there is no { ... }
	this.NewPseudoBlock = function(out, generate, Node, Statement, inLoop) {
		Node.scopeId = "Stmt" + (++this.StatementBlocks);
		this.NewScope(Node.scopeId, Node);
		if (Statement.type == jsdef.LET) {
			out.push("{");
			!inLoop && out.push(this.ScopeId + Node.scopeId + "={};");
			out.push(generate(Statement) + "}");
		}
		else {
			out.push(generate(Statement));
		}
		
		this.ExitScope();
	};
	
	//Get the current scope based on regular JS scoping rules (nearest function or global only)
	this.ScopeJS = function(currentScopeId) {
		return this.CurrentFunction(currentScopeId) ||  this.scopeChain[0];
	};
	
	this.isGlobalScope = function(x) {
		return this.scopeChain.length === 1;
	};
	
	this.typeSystem = null;
	//this.conditionals - keeps track of conditionals
	//useful for if (1) { var a as Number; } else { var a as String; }
	this.conditionals = [];
	this.TypeCheck = function(Node) {
		this.typeSystem !== null && this.typeSystem.typesys(Node, this);
	};
	
	//Traverses scope chain until findIdentifier is found starting at currentScopeId
	this.LookupScopeChain = function (findIdentifier, currentScopeId, callback, property) {
		var found = false, isBlockVariable = false, isClassMember = false, data;
		var currentScope = _this.scopeChain[currentScopeId] || _this.scopeChain[0];
		var Variables = currentScope.Variables, classScopeId = -1;
		var Functions = currentScope.Functions, isFunDecl = false;

		//Search function declarations first (not function expressions)
		for (var i=0, len=Functions.length; i < len; i++) {
			if (Functions[i].name === findIdentifier) {
				found = true;
				isFunDecl = true;
				
				data = Functions[i];
				
				break;
			}
		}
		
		//Search variable declarations after function declarations
		for (var i=0, len=Variables.length; i < len; i++) {
			if (Variables[i].identifier === findIdentifier) {
				found = true;
				
				if (Variables[i]["[[ClassMember]]"]) {
					isClassMember = true;
					classScopeId = Variables[i]["[[ClassId]]"];
				}
				
				data = Variables[i];
				
				break;
			}
		}
		
		//Finally, check if this is a block scoped variable
		if (currentScope.map_BlockVars.hasOwnProperty(findIdentifier)) {
			found = true;
			isBlockVariable = true;
			isClassMember = false;
			data = currentScope.map_BlockVars[findIdentifier];
		}
		
		//Keep moving up the chain until we find the variable
		if (!found && currentScope !== _this.scopeChain[0]) {
			_this.LookupScopeChain(findIdentifier, --currentScopeId, callback);
						
			return;
		}
		
		if (found) {
			typeof callback == "function" && callback({
				found: true,
				scopeId: currentScope.scopeId,
				classScopeId: classScopeId,
				isBlockVariable: isBlockVariable,
				isClassMember: isClassMember,
				isFunctionDecl: isFunDecl,
				data: data
			});
		}
		else {
			typeof callback == "function" && callback(false);
		}
	};
	
	//Create temporary variables
	var tmpVarIndex = 0;
	this.CreateTempVar = function() {
		var tmp = "__TMP" + (++tmpVarIndex) + "__";
		
		while(~this.varCache.indexOf(tmp)) tmp = "__TMP" + (++tmpVarIndex) + "__";
		
		this.varCache.push(tmp);
		
		return tmp;
	};
	this.varCache = []; //Keep track of used identifiers - including lexically scoped vars
	this.varCache.push = function(x) { //Modify push function to avoid duplicates
		!~this.indexOf(x) && Array.prototype.push.apply(this, Array.isArray(x) ? x : [x]);
	};
	this.PushToVarCache = function(nodes) {
		for (var i=0, item, len=nodes.length; i<len; i++) {
			if (nodes[i].type == jsdef.LET) continue;
			
			for (item in nodes[i]) {
				if (!isFinite(item)) continue;
			
				if (nodes[i][item].type == jsdef.IDENTIFIER) //In case of destructuring assignments
					this.varCache.push(nodes[i][item].value);
			}
		}
	};
	
	//Reduce functions
	this.reduceVarInit = function(node) {
		switch(node.type) {
			case jsdef.GROUP:
			case jsdef.CALL:
				return this.reduceVarInit(node[0]);
			case jsdef.COMMA:
				return this.reduceVarInit(node[node.length-1]);
			case jsdef.OBJECT_INIT:
			case jsdef.FUNCTION:
				return node;
			default:
				break;
		}
	};
	
	//Types
	//Define default values
	this.types = {
		"Array": {
			"default": "[]"
		},
		"Boolean": {
			"default": "false"
		},
		"Date": {
			"default": "new Date"
		},
		"Function": {
			"default": "function(){}"
		},
		"Null": {
			"default": "null"
		},
		"Number": {
			"default": "0"
		},
		"Object": {
			"default": "{}"
		},
		"RegExp": {
			"default": "/(?:)/"
		},
		"String": {
			"default": '""'
		},
		
		//Typed arrays
		"Array[]": {
			"default": "[]"
		},
		"Boolean[]": {
			"default": "[]"
		},
		"Date[]": {
			"default": "[]"
		},
		"Function[]": {
			"default": "[]"
		},
		"Number[]": {
			"default": "[]"
		},
		"Object[]": {
			"default": "[]"
		},
		"RegExp[]": {
			"default": "[]"
		},
		"String[]": {
			"default": "[]"
		}
	};
	//Return [[Prototype]] based on type
	this.GetProto = function(s) {
		if (typeof CreateGlobal != "function") return void 0;
		switch(s) {
			//Built-in objects
			case "Array": return CreateGlobal.Array.properties.prototype;
			case "Boolean": return CreateGlobal.Boolean.properties.prototype;
			case "Date": return CreateGlobal.Date.properties.prototype;
			case "Function": return CreateGlobal.Function.properties.prototype;
			case "Number": return CreateGlobal.Number.properties.prototype;
			case "Object": return CreateGlobal.Object.properties.prototype;
			case "RegExp": return CreateGlobal.RegExp.properties.prototype;
			case "String": return CreateGlobal.String.properties.prototype;
			case "Error":
			case "EvalError":
			case "RangeError":
			case "ReferenceError":
			case "SyntaxError":
			case "TypeError":
			case "URIError":
				return CreateGlobal.Error.properties.prototype;
				
			//TODO: Typed arrays
		}
	};
	
	this.currentLabel = ""; //Labels for loops
	this.breakStmt = ""; //Track break statements
	this.continueStmt = ""; //Track continue statements
	this.inCase = false; //Are we inside a case/default statement?
	
	//Classes
	this.currentClass = "";
	this.classId = "";
	this.classMembers = {};
	this.classScopes = [];
	this.classes = {};
	this.classVars = [];
	
	this.NewClass = function(Node) {
		this.currentClass = Node.name || "";
		this.classScope = this.classScopes.push(this.NewScope(Node.scopeId, Node));
		
		this.classes[Node.body.scopeId] = {
			id: Node.name,
			__SUPER__: Node.extends || "",
			protectedMembers: [],
			publicMembers: []
		};
	};
	
	this.CurrentClass = function() {
		return this.classScopes[this.classScopes.length-1];
	};
	
	this.CurrentClassName = function() {
		return this.classScopes[this.classScopes.length-1].name;
	};
	
	this.ChainedClassName = function() {
		var ret = [];
		
		for (var i=0, k=this.classScopes, len=k.length; i<len; i++) {
			ret.push(k[i].name);
		}
		
		return ret;
	};
	
	this.AdjustedChainedClassName = function() {
		//Are we inside a static class expression?
		for (var i=0,k=this.classScopes,len=k.length;i<len;i++) {
			if (k[i].static) break;
		}
		
		if (this.classScopes.length > 1 && i === k.length) {
			return this.CurrentClassName();
		}
		else {
			return this.ChainedClassName().join(".");
		}
	};
	
	this.CurrentClassScopeId = function() {
		return this.classScopes[this.classScopes.length-1].body.scopeId;
	};
	
	this.InsideClass = function() {
		return this.scopeChain[this.scopeChain.length-1] && 
			   this.scopeChain[this.scopeChain.length-1].type == jsdef.CLASS;
	};
	
	this.InsideStaticMember = function() {
		return !!this.classVars.length && 
				(!!this.classVars[this.classVars.length-1].static ||
				 !!this.classVars[this.classVars.length-1].body.static);
	};
	
	this.ExitClass = function() {
		this.currentClass = "";
		this.classMembers = {};
		this.classScopes.pop();
		delete this.classScope;
		this.ExitScope();
	};
}
compiler.prototype.typesys = {}; //Storage for pluggable type systems

compiler.prototype.compile = function (ast) {
	var out = [], _this = this, ast = ast || this.ast, context, scope;
	var generate = function(){
		return _this.compile.apply(_this, Array.prototype.slice.call(arguments,0));
	};
	
	if (this.options.debug && ast.lineno != this.lineno) {
		this.lineno != -1 && out.push("\n");
		out.push("\/\/@line " + ast.lineno + "\n");
		this.lineno = ast.lineno;
	}

	//Traverse the AST
	switch(ast.type) {
		//Scopes
		case jsdef.SCRIPT:
			this.CreateExecutionContext(ast.contextId);
			context = this.GetContext(ast.contextId);
			this.NewScope(ast.scopeId, ast);
			
			var isGlobalScope = this.isGlobalScope();
			
			if (isGlobalScope) {
				this.PushToVarCache(ast.varDecls);
				!this.options.nowrap && out.push("(function(global){");
				
				//If we plugged in a type system, declare the conversion functions
				if (this.typeSystem !== null) {
					out.push("var ArrayArray=Array,");
					out.push("BooleanArray=function(){for(var i=arguments.length-1;i>=0;i--)arguments[i]=!!arguments[i];return [].slice.call(arguments)},");
					out.push("DateArray=function(){for(var i=arguments.length-1;i>=0;i--)arguments[i]=Date(arguments[i]);return [].slice.call(arguments)},");
					out.push("FunctionArray=function(){" +
								"var r=[],a=arguments;" +
								"for(var i=a.length-1;i>=0;i--)" +
								"typeof a[i]=='function'&&r.push(a[i]);" +
								"return r},");
					out.push("NumberArray=function(){for(var i=arguments.length-1;i>=0;i--)arguments[i]=+arguments[i];return [].slice.call(arguments)},");
					out.push("ObjectArray=function(){for(var i=arguments.length-1;i>=0;i--)arguments[i]=Object(arguments[i]);return [].slice.call(arguments)},");
					out.push("RegExpArray=function(){for(var i=arguments.length-1;i>=0;i--)arguments[i]=RegExp(arguments[i]);return [].slice.call(arguments)},");
					out.push("StringArray=function(){for(var i=arguments.length-1;i>=0;i--)arguments[i]=arguments[i]+'';return [].slice.call(arguments)};");
				}
			}
			
			//Handle function declarations
			var scope = this.CurrentScope();
			for (var i=0, len=ast.funDecls.length; i<len; i++) {
				scope.Functions.push(ast.funDecls[i]);
			}
			
			if (Array.isArray(ast.params)) {
				var id = "", varObj = {};
				
				for (var i=0, len=ast.params.length; i<len; i++) {
					varObj = {
						identifier: id = ast.params[i],
						value: undefined,
						properties: {},
						
						//Internal properties
						"[[ReadOnly]]": false,
						"[[DontEnum]]": false,
						"[[DontDelete]]": true
					};
					
					context.ActivationObject.arguments.value[id] = undefined;
					context.ActivationObject.arguments.length++;
					context.Variables.push(varObj);
					this.CurrentScope().Variables.push(varObj);
				}
			}
			
			//Loop variable declarations to find conflicting identifiers
			for (var i=0, len=ast.varDecls.length; i<len; i++) {
				if (ast.varDecls[i].type === jsdef.IDENTIFIER) {
					while (ast.varDecls[i].value === this.currentScope) {
						this.currentScope = "_" + this.ScopeId;
					}
					
					context.Variables.push(ast.varDecls[i].value);
				}
			}
			
			var body = [];
			out.push("var " + this.currentScope + "={};");
			
			for (var item in ast) {
				if (!isFinite(item)) continue;
				
				ast[item].parent = this.context;
				body.push(generate(ast[item]));
			}
			out = out.concat(body);
			
			//Delete scoped object extensions
			for (var i=0, len=context.Extensions.length; i<len; i++) {
				out.push("delete " + context.Extensions[i] + ";");
			}
			
			if (isGlobalScope) {
				!this.options.nowrap && out.push("}).call({},this);");
				this.varCache = null;
			}
			
			this.ExitScope();
			this.ExitContext();
			
			break;
		case jsdef.BLOCK:
			this.NewScope(ast.scopeId, ast);
			
			out.push("{");
			!ast.isLoop && out.push("var " + this.currentScope + "={};");
			for (var item in ast) {
				if (!isFinite(item)) continue;
				
				ast[item].parent = this.context;
				
				out.push(generate(ast[item]));
			}
			!ast.isLoop && out.push(this.currentScope + "=null;");
			
			if (this.inCase) { //inside a case/default statement?
				if (this.breakStmt) {
					out.push(this.breakStmt);
					this.breakStmt = "";
				}
				else if (this.continueStmt) {
					out.push(this.continueStmt);
					this.continueStmt = "";
				}
			}
			
			out.push("}");
			
			this.ExitScope();
			
			break;
			
		//Classes
		case jsdef.CLASS:
			var constructor = [],
				destructor = [],
				staticConstructor = [],
				classItems = [],
				methods = {},
				currentItem,
				duplicates = [],
				privateMembers = []; //Check for re-declarations of vars/functions
			
			this.NewClass(ast);
			
			//If this is a subclass, get the superclass data
			if (ast.extends) {
				var j, superClass, superClassId;
				for (var i in this.classes) {
					j = this.classes[i];
					if (j && j.id && j.id === ast.extends) {
						superClass = j;
						superClassId = i;
						break;
					}
				}
			}
			
			//Find constructors/destructor
			for (var item in ast.body) {
				if (!isFinite(item)) continue;
				
				currentItem = ast.body[item];
				
				if (currentItem.type === jsdef.FUNCTION) {
					if (currentItem.name == "Constructor" ||
						currentItem.name == null || currentItem.name === "") {
						if (currentItem.static) {
							if (staticConstructor.length) {
								this.NewError({
									type: SyntaxError,
									message: "Multiple static constructors" +
												"detected for " + ast.name
								}, ast);
							}
							
							if (currentItem.private || currentItem.public || 
								currentItem.protected) {
								this.NewWarning({
									type: SyntaxError,
									message: "Static constructors cannot " +
												"have access modifiers"
								}, ast);
							}
							
							if (currentItem.params && currentItem.params.length) {
								this.NewWarning({
									type: SyntaxError,
									message: "Static constructors cannot " +
												"have parameters"
								}, ast);
								
								currentItem.params = [];
								currentItem.paramsList = [];
							}
						}
						
						if (currentItem.static) {
							staticConstructor.push(currentItem);
						}else {
							constructor.push(currentItem); //Overloadable
						}
					}
					else if (currentItem.name == "Destructor") {
						//Throw error for multiple destructors
						if (destructor.length) {
							this.NewError({
								type: SyntaxError,
								message: "Multiple destructors detected for " +
											ast.name
							}, ast);
						}
						
						/* 
						 * Throw warning for non-static destructors
						 * Unlike other languages (C++, C#), destructors
						 * must be static for us to access it.
						 * Even privileged methods with closures still make
						 * the destructor accessible
						 */
						if (!currentItem.static) {
							this.NewWarning({
								type: SyntaxError,
								message: "Non-static destructor detected"
							}, ast);
						}
						if (currentItem.private || currentItem.public ||
							currentItem.protected) {
							this.NewWarning({
								type: SyntaxError,
								message: "Destructors cannot have access modifiers"
							}, ast);
						}
						
						destructor.push(currentItem);
					}
					else {
						//Overload method
						if (methods.hasOwnProperty(currentItem.name)) {
							//Check for duplicate method declarations
							for (var i=0, len=methods[currentItem.name].length;
									i<len;
									i++) {
								if (methods[currentItem.name][i].params.length === 
									currentItem.params.length) {
									
									for (var j=0,
										_len=methods[currentItem.name][i].paramsList.length;
										j<_len;
										j++) {
										
										if (methods[currentItem.name][i].paramsList[j].vartype !=
											currentItem.paramsList[j].vartype)
											break;
									}
									
									if (j == _len) {
										this.NewError({
											type: SyntaxError,
											message: "Method '" + currentItem.name +
														"' has already been defined in " +
														"class '" + this.currentClass + 
														"'. Rename this member or use " +
														"different parameters."
										}, ast);
									}
								}
							}
							
							methods[currentItem.name].push(currentItem);
						}
						//No overloading
						else {
							methods[currentItem.name] = [currentItem];
						}
						classItems.push(currentItem);
					}
					
					!~duplicates.indexOf(currentItem.name) && 
						duplicates.push(currentItem.name);
						
					//Push methods to classMembers first in case "var"
					//statements rewrite our function declarations later
					this.classMembers[currentItem.name] = currentItem;
					
					//Push to private members
					privateMembers.push(currentItem.name);
					
					//For method declarations (and not method expressions), we
					//should push the declaration to the "Variables" object so
					//identifier resolution will resolve properly
					this.CurrentClass().Variables.push({
						identifier: currentItem.name,
						properties: {},
					
						//Standard internal properties
						"[[ReadOnly]]": false,
						"[[DontEnum]]": false,
						"[[DontDelete]]": !!currentItem.private,
					
						//Non-standard internal properties
						"[[Public]]": !!currentItem.public,
						"[[Private]]": !!currentItem.private,
						"[[Static]]": !!currentItem.static,
						"[[Protected]]": !!currentItem.protected,
						"[[ClassMember]]": true,
						"[[MemberOf]]": this.currentClass,
						"[[ClassId]]": this.CurrentClassScopeId()
					});
				
					if (ast.public) {
						this.classes[this.CurrentClassScopeId()].publicMembers.push(currentItem.name);
					}
					if (ast.protected) {
						this.classes[this.CurrentClassScopeId()].protectedMembers.push(currentItem.name);
					}
				}
				else {
					classItems.push(currentItem);
					
					if (currentItem.type == jsdef.VAR) {
						if (currentItem.private) {
							for (var varNode in currentItem) {
								if (!isFinite(varNode)) continue;
							
								privateMembers.push(currentItem[varNode].value);
							}
						}
						
						//Save variable declaration early for identifier resolution
						//We don't actually do any code generation here
						//This is to ensure when we process method declarations
						//first, it will still resolve the variables correctly
						var id = "";
						for (var varDecl in currentItem) {
							if (!isFinite(varDecl)) continue;
							
							this.CurrentClass().Variables.push(varObject = {
								identifier: id = currentItem[varDecl].value,
								properties: {},
					
								//Standard internal properties
								"[[ReadOnly]]": false,
								"[[DontEnum]]": false,
								"[[DontDelete]]": true,
					
								//Non-standard internal properties
								"[[Type]]": currentItem[varDecl].vartype,
								"[[Public]]": !!currentItem.public,
								"[[Private]]": !!currentItem.private,
								"[[Static]]": !!currentItem.static,
								"[[Protected]]": !!currentItem.protected,
								"[[ClassMember]]": true,
								"[[MemberOf]]": this.currentClass,
								"[[ClassId]]": this.CurrentClassScopeId()
							});
					
							if (ast.public) {
								this.classes[this.CurrentClassScopeId()].publicMembers.push(id);
							}
							else if (ast.protected) {
								this.classes[this.CurrentClassScopeId()].protectedMembers.push(id);
							}
						}
					}
					else if (currentItem.type == jsdef.CLASS) {
						currentItem.nestedParent = ast;
					}
				}
			}
			ast.privateMembers = privateMembers;
			staticConstructor = staticConstructor.pop();
			destructor = destructor.pop();

			//Wrap in a function so we can call via: new foo(x,y,z)
			out.push("function " + (ast.name || "") + "(){");
			out.push("var __SUPER__" +
					 (superClassId !== void 0 ? ",__CLASS" + superClassId + "__" : "") +
					 ";");
			
			if (ast.nestedParent) {
				//Static class expressions
				if (ast.classForm && ast.static) {
					/*out.push("var __CLASS" + ast.nestedParent.body.scopeId + 
								"__=__CLASSES__[" + ast.nestedParent.body.scopeId + "];");*/
				}
				else {
					//Cleanup
					for (var i=0, len=ast.nestedParent.privateMembers.length;
							i<len; i++) {
						if (typeof ast.nestedParent.privateMembers[i] == 
							"undefined") {
							ast.nestedParent.privateMembers.splice(i,1);
						}
					}
						
					//If this is a nested non-static class, we need to redeclare all private
					//variables of the superclass.  Unfortunately, this causes issues
					//with ReferenceErrors because it's technically defined according
					//to the activation object, but we can't "delete" variables that have
					//the internal [[DontDelete]] flag
					if (ast.nestedParent.privateMembers.length) {						
						out.push("var " + ast.nestedParent.privateMembers.join(",") + ";");
					}
				}
			}
			
			out.push("return ((function(){");
			
			//Store protected variables, regular "var" declarations don't
			//work for nested classes
			var classId = this.classId = "__CLASS" + ast.body.scopeId + "__";
			
			out.push("var " + classId + "=this,");
			//Don't use "Object" to avoid identifier lookup
			out.push("__PDEFINE__={}.constructor.defineProperty,");
			out.push("__NOENUM__={enumerable:false};");
			out.push("if(typeof __PDEFINE__!='function')__PDEFINE__=null;");
			//Test defineProperty (IE8)
			//Includes conditional compilation directives for optimization
			out.push("/*@cc_on @if(1)try{({}).constructor.defineProperty({},'x',{})}catch(e){__PDEFINE__=null}@end @*/");

			out.push("this.__SUPER__=__SUPER__;");
			out.push("__PDEFINE__&&__PDEFINE__(this,'__SUPER__',__NOENUM__);");
			out.push("this.__PROTECTED__={};");
			out.push("__PDEFINE__&&__PDEFINE__(this,'__PROTECTED__',__NOENUM__);");
			
			//Push methods - we do this separately in case of overloading
			//Methods should come first to make class method declarations behave
			//like JS function declarations
			var _out, staticItems = [];
			for (var i in methods) {
				//Method is not overloaded, just push it
				if (methods[i].length == 1) {
					this.classVars.push(methods[i][0]);
					
					_out = methods[i][0].static ?
						((methods[i][0].body.static = true), staticItems) : out;
					_out.push(generate(methods[i].shift()));
					
					this.classVars.pop();
				}
				//Overloaded method
				else {
					//TODO: method overloading
					/*_out.push("function " + methods[i][0].name + "(){");
					var firstVar = true;
					for (var j=0,_len=methods[i].length;j<_len;j++) {
						_out = methods[i][j].static ? staticItems : out;
						if (methods[i][j].params.length) {
							_out.push("if(arguments.length==");
							_out.push(methods[i][j].params.length + ") {");
							_out.push("var ");
							for (var k=0,__len=methods[i][j].paramsList.length;k<__len;k++) {
								if (!firstVar) _out.push(",");
							
								_out.push(methods[i][j].paramsList[k].value);
							
								if (methods[i][j].paramsList[k].initializer) {
									_out.push("=arguments[" + k + "]!==undefined?" + 
										"arguments[" + k + "]:" +
										generate(methods[i][j].paramsList[k].initializer));
								}
								else {
									_out.push("=arguments[" + k + "]!==undefined?" + 
										"arguments[" + k + "]" + 
										":undefined");
								}
							
								_out.push(";");
								_out.push(generate(methods[i][j].body));
								_out.push(this.currentScope + "=null;");
								_out.push("}");
							
								firstVar = false;
							}
							firstVar = true;
						}
						else {
							_out.push("if(!arguments.length){");
							_out.push(generate(methods[i][j].body));
							_out.push(this.currentScope + "=null;");
							_out.push("}");
						}
					}
					_out.push("}");*/
				}
			}
			
			//Class body
			var currentClassItem, currentVar;
			for (var i=0, len=classItems.length; i<len; i++) {
				if (classItems[i].type == jsdef.VAR) {
					for (var varObject in classItems[i]) {
						currentVar = classItems[i][varObject];
						
						if (!isFinite(varObject)) continue;
						
						//Check for method re-declarations as variables
						if (~duplicates.indexOf(currentVar.name)) {
							this.NewWarning({
								type: SyntaxError,
								message: "Redeclaration of method " + currentVar.name
							}, ast);
							
							//Overwrite due to re-declaration
							//Don't delete to prevent overwritten method being
							//pushed to staticItems
							methods[currentVar.name] = [{}];
						}
						//Check for invalid identifiers
						else if (~["__PROTECTED__", "__SUPER__", "__PDEFINE__",
									"__NOENUM__",
									classId,
									"Constructor",
									"Destructor"].
									indexOf(classItems[i][varObject].name)) {
							this.NewError({
								type: SyntaxError,
								message: "Invalid identifier for member " +
											classItems[i][varObject].name
							}, ast);
						}
						
						//Push to classMembers after function declarations
						//have already been pushed in case var declarations
						//redeclare identifiers used for function declarations
						this.classMembers[currentVar.name] = currentVar;
					}
				}
				
				if (classItems[i].static && !classItems[i].private &&
					!classItems[i].protected && !methods.hasOwnProperty(classItems[i].name)) {
											
					if (ast.name) {
						this.classVars.push(ast);
						
						staticItems.push((classItems[i].type == jsdef.FUNCTION ? 
										ast.name : "") + generate(classItems[i]));
										
						this.classVars.pop();
					}
					else {
						this.NewError({
							type: SyntaxError,
							message: "Anonymous classes cannot have static members " +
										"except for constructors and destructors."
						}, ast);
					}
				}
				else if (classItems[i].type !== jsdef.FUNCTION) {
					out.push(generate(classItems[i]));
				}
			}
			
			//Define the constructor and destructor last
			
			//Constructors
			if (constructor.length) {
				//Single constructor
				if (constructor.length == 1) {
					constructor = constructor.pop();
					
					out.push("this.Constructor=function(){");
					
					for (var i=0,len=constructor.paramsList.length;i<len;i++) {
						out.push("var " + constructor.paramsList[i].name +
								 "=arguments[" + i + "]");
						if (constructor.paramsList[i].initializer) {
							out.push("!==undefined?arguments[" + i + "]:");
							out.push(generate(constructor.paramsList[i].initializer));
						}
						out.push(";");
					}
					out.push(generate(constructor.body));
					
					out.push("return " + classId + "};");
				}
				//Overloaded constructor
				else {
					out.push("this.Constructor=function(){");
					var firstVar = true;
					for (var i=0,len=constructor.length;i<len;i++) {
						if (constructor[i].params.length) {
							out.push("if(arguments.length==");
							out.push(constructor[i].params.length + ") {");
							out.push("var ");
							for (var j=0,_len=constructor[i].paramsList.length;j<_len;j++) {
								if (!firstVar) out.push(",");
							
								out.push(constructor[i].paramsList[j].value);
							
								if (constructor[i].paramsList[j].initializer) {
									out.push("=arguments[" + j + "]!==undefined?" + 
										"arguments[" + j + "]:" +
										generate(constructor[i].paramsList[j].initializer));
								}
								else {
									out.push("=arguments[" + j + "]!==undefined?" + 
										"arguments[" + j + "]" + 
										":undefined");
								}
									
								firstVar = false;
							}
							out.push(";");
							out.push(generate(constructor[i].body));
							out.push(this.currentScope + "=null;");
							out.push("}");
							firstVar = true;
						}
						else {
							out.push("if(!arguments.length){");
							out.push(generate(constructor[i].body));
							out.push(this.currentScope + "=null;");
							out.push("}");
						}
					}
					out.push("return " + classId + "};");
				}
			}
			//No constructor
			else {
				out.push("this.Constructor=function(){return " + classId + "};");
			}
			out.push("__PDEFINE__&&__PDEFINE__(this,'Constructor',__NOENUM__);");
			
			//Destructor
			if (destructor) {
				out.push((ast.name || "") + ".Destructor=function(){");
				out.push(generate(destructor.body));
				out.push("};");
				out.push("__PDEFINE__&&__PDEFINE__(this,'Destructor',__NOENUM__);");
			}
			
			//Run static constructor last
			if (staticConstructor) {
				out.push("(function(){");
				out.push(generate(staticConstructor.body));
				out.push("}).call(this);");
			}
			
			out.push("return this");
			
			out.push("}).call(");
			
			if (ast.extends) {
				out.push("(function(o){return (F.prototype=__SUPER__=" +
						 (superClassId !== void 0 ? "__CLASS" + superClassId + "__=" : "") + 
						 "o,new F);function F(){}})(" +
						 "new " + ast.extends + ")");
			}
			else {
				out.push("{}");
			}
			out.push("))");
			
			//Call the constructor
			out.push(".Constructor.apply(this,[].slice.call(arguments))}");
			
			//Add semicolon for nested class expressions
			if (ast.public || ast.private || ast.static || ast.protected) out.push(";");
			
			//Include static declarations
			out.push(staticItems.join(""));
			
			this.ExitClass();
			
			break;
			
		//Groups
		case jsdef.GROUP:
			out.push("(");
			for (var item in ast) {
				if (!isFinite(item)) continue;
					
				out.push(generate(ast[item]));
			}
			out.push(")");
			break;
		case jsdef.COMMA:
			var firstItem = true;
			for (var item in ast) {
				if (!isFinite(item)) continue;
				
				if (!firstItem) out.push(",");
				
				out.push(generate(ast[item]));
				
				firstItem = false;
			}
			break;
			
		//Functions
		case jsdef.FUNCTION:
			this.TypeCheck(ast);
			this.PushToVarCache(ast.body.varDecls);
			
			if (ast.static) {
				if (!ast.name) {
					this.NewWarning({
						type: SyntaxError,
						message: "Missing method identifier"
					}, ast);
				}
				
				if (ast.private) {
					if (!ast.reduced) {
						out.push("var " + ast.name + "=function(");
					}
					else {
						out.push("function(");
					}
				}
				else if (ast.protected) {
					out.push("this.__PROTECTED__." + ast.name + "=function(");
				}
				else {
					out.push(this.AdjustedChainedClassName() + "." + ast.name + "=function(");
				}
			}
			else if (ast.private) {
				if (!ast.name) {
					this.NewWarning({
						type: SyntaxError,
						message: "Missing method identifier"
					}, ast);
				}
				
				if (!ast.reduced) {
					out.push("var " + ast.name + "=function(");
				}
				else {
					out.push("function(");
				}
			}
			else if (ast.protected) {
				if (!ast.name) {
					this.NewWarning({
						type: SyntaxError,
						message: "Missing method identifier"
					}, ast);
				}
				
				out.push("this.__PROTECTED__." + ast.name + "=function(");
			}
			else if (ast.public) {
				if (!ast.name) {
					this.NewWarning({
						type: SyntaxError,
						message: "Missing method identifier"
					}, ast);
				}
				
				out.push("this." + ast.name + "=function(");
			}
			else {
				out.push("function" + (ast.name ? (" " + ast.name) : "") + "(");
			}
			
			out.push(ast.params.join(","));
			out.push("){");
			
			//Default parameters
			var defParams = [];
			for (var i=0, len=ast.paramsList.length; i<len; i++) {
				if (ast.paramsList[i].initializer) {
					defParams.push(ast.paramsList[i].value + "=");
					defParams.push(ast.paramsList[i].value + "==null?");
					defParams.push(generate(ast.paramsList[i].initializer));
					defParams.push(":" + ast.paramsList[i].value);
					defParams.push(";");
				}
				else if (ast.paramsList[i].restParameter) {
					defParams.push(ast.paramsList[i].value + "=");
					defParams.push("Array.prototype.slice.call(arguments,"+ i +");");
				}
			}
			out = out.concat(defParams);
			
			ast.body.params = ast.params;
			ast.body.isFunction = true;
			ast.body.returntype = ast.returntype;
			var funcBody = generate(ast.body);
			
			//Convert "arguments" object to array ONLY if it's used in function body
			if (ast.body.usesArgs) {
				out.push("var args=[].slice.call(arguments);");
			}
			
			out.push(funcBody);
			
			if (this.types.hasOwnProperty(ast.returntype)) {
				out.push("return " + this.types[ast.returntype]["default"]);
			}
			
			out.push("}");
			if (!ast.reduced &&
				(ast.public || ast.private || ast.static || ast.protected)) {
				out.push(";");
			}
			
			break;
		case jsdef.CALL:
			out.push(generate(ast[0]));
			ast[0].type == jsdef.REGEXP && out.push(".exec");
			out.push("(");
			out.push(generate(ast[1]));
			out.push(")");
			break;
		case jsdef.RETURN:
			this.TypeCheck(ast);
			out.push("return ");
			out.push(generate(ast.value));
			out.push(";");
			break;
		case jsdef.LIST:
			var firstItem = true;
			for (var item in ast) {
				if (!isFinite(item)) continue;
				
				if (!firstItem) out.push(",");
				
				out.push(generate(ast[item]));
				
				firstItem = false;
			}
			break;
			
		//Conditionals
		case jsdef.IF:
			out.push("if(");
			out.push(generate(ast.condition));
			out.push(")");
			this.conditionals.push(ast);
			if (ast.thenPart.type != jsdef.BLOCK) {
				this.NewPseudoBlock(out, generate, ast, ast.thenPart, false);
			}else {
				out.push(generate(ast.thenPart));
			}
			if (ast.elsePart) {
				out.push("else ");
				if (ast.elsePart.type != jsdef.BLOCK) {
					this.NewPseudoBlock(out, generate, ast, ast.elsePart, false);
				}
				else {
					out.push(generate(ast.elsePart));
				}
			}
			this.conditionals.pop()
			break;
		case jsdef.SWITCH:
			out.push("switch(" + generate(ast.discriminant) + "){");
			
			for (var _case in ast.cases) {
				if (!isFinite(_case)) continue;
				
				out.push(generate(ast.cases[_case]));
			}
			out.push("}");
			break;
		case jsdef.CASE:
			this.inCase = true;
			out.push("case " + generate(ast.caseLabel) + ":");
			
			ast.statements.scopeId = "Stmt" + (++this.StatementBlocks);
			this.NewScope(ast.statements.scopeId, Node);
		
			if (ast.statements && ast.statements[0] && 
				ast.statements[0].value && ast.statements[0].value != ":") {
				out.push(generate(ast.statements));
			}
			this.inCase = false;
			this.ExitScope();
			
			break;
		case jsdef.DEFAULT:
			this.inCase = true;
			out.push("default:");
			
			ast.statements.scopeId = "Stmt" + (++this.StatementBlocks);
			this.NewScope(ast.statements.scopeId, Node);
			
			if (ast.statements && ast.statements[0] && 
				ast.statements[0].value && ast.statements[0].value != ":") {
				out.push(generate(ast.statements));
			}
			this.inCase = false;
			this.ExitScope();
			
			break;
			
		//Loops
		case jsdef.FOR:
			ast.scopeId = "Stmt" + (++this.StatementBlocks);
			this.NewScope(ast.scopeId, ast);
			
			var setupFor = ast.setup ? generate(ast.setup) : ";";			
			ast.body.isLoop = true;
			
			if (ast.body.scopeId) out.push("var " + this.ScopeId + ast.body.scopeId + "={};");
			
			out.push("var " + this.ScopeId + "Stmt" + (this.StatementBlocks) + "={};");
			
			if (ast.setup && ast.setup.type == jsdef.LET) {
				out.push(setupFor + this.currentLabel + "for(;");
			}else {
				out.push(
						 this.currentLabel + "for(" + setupFor +
						 (setupFor.slice(-1) == ";" ? "": ";")
						);
			}
			out.push((ast.condition ? generate(ast.condition) : "") + ";");
			out.push((ast.update ? generate(ast.update) : "") + ")");
			
			if (ast.body.type == jsdef.LET) {
				out.push("{" + generate(ast.body) + "}");
			}
			else {
				out.push(generate(ast.body));
			}
			
			out.push(this.ScopeId + "Stmt" + (this.StatementBlocks) + "=null;");
		
			this.ExitScope();
			
			break;
		case jsdef.FOR_IN:
			ast.scopeId = "Stmt" + (++this.StatementBlocks);
			this.NewScope(ast.scopeId, ast);
					
			ast.body.isLoop = true;
			
			if (ast.body.scopeId) out.push("var " + this.ScopeId + ast.body.scopeId + "={};");
			
			out.push("var " + this.ScopeId + "Stmt" + (this.StatementBlocks) + "={};");
			
			if (ast.iterator.type == jsdef.LET) {
				out.push(generate(ast.iterator) + this.currentLabel + "for(" + this.ScopeId + "Stmt" + (this.StatementBlocks));
				out.push("." + this.CurrentScope().map_BlockVars[ast.iterator[0].value]);
			}
			else if (ast.iterator.type == jsdef.VAR || ast.iterator.type == jsdef.IDENTIFIER) {
				out.push(this.currentLabel + "for(" + 
							(ast.iterator.type == jsdef.VAR ? 
								"var " + ast.iterator[0].value :
								ast.iterator.value
							)
						);
			}
			else {
				this.NewError({
					type: SyntaxError,
					message: "Invalid left-hand side in for-in"
				}, ast);
			}
			out.push(" in " + (ast.object ? generate(ast.object) : "") + ")");
			
			if (ast.body.type == jsdef.LET) {
				out.push("{" + generate(ast.body) + "}");
			}
			else {
				out.push(generate(ast.body));
			}
			
			out.push(this.ScopeId + "Stmt" + (this.StatementBlocks) + "=null;");
		
			this.ExitScope();
			
			break;
		case jsdef.FOR_INSIDE:
			ast.scopeId = "Stmt" + (++this.StatementBlocks);
			this.NewScope(ast.scopeId, ast);
			
			var identifier = "";
					
			ast.body.isLoop = true;
			
			if (ast.body.scopeId) out.push("var " + this.ScopeId + ast.body.scopeId + "={};");
			
			out.push("var " + this.ScopeId + "Stmt" + (this.StatementBlocks) + "={};");
			
			if (ast.iterator.type == jsdef.LET) {
				out.push(generate(ast.iterator) + this.currentLabel + "for(" +
							this.ScopeId + "Stmt" + (this.StatementBlocks));
				out.push("." + this.CurrentScope().map_BlockVars[identifier = ast.iterator[0].value]);
			}
			else if (ast.iterator.type == jsdef.VAR || ast.iterator.type == jsdef.IDENTIFIER) {
				out.push(this.currentLabel + "for(" + 
							(ast.iterator.type == jsdef.VAR ? 
								"var " + (identifier=ast.iterator[0].value) :
								(identifier=ast.iterator.value)
							)
						);
			}
			else {
				this.NewError({
					type: SyntaxError,
					message: "Invalid left-hand side in for-inside"
				}, ast);
			}
			var tmp = this.CreateTempVar();
			out.push(" in " + tmp + "=");
			out.push((ast.object ? generate(ast.object) : "") + ")");
			
			out.push("if(Object.prototype.hasOwnProperty.call(" + tmp + ",");
			if (ast.iterator.type == jsdef.LET) {
				out.push(this.ScopeId + "Stmt" + (this.StatementBlocks) + ".");
				out.push(this.CurrentScope().map_BlockVars[identifier]);
			}
			else {
				out.push(identifier);
			}
			out.push(")){" + generate(ast.body) + "}");
			
			out.push(this.ScopeId + "Stmt" + (this.StatementBlocks) + "=null;");
		
			this.ExitScope();
			
			break;
		case jsdef.WHILE:
			ast.body.isLoop = true;
			if (ast.body.scopeId) out.push("var " + this.ScopeId + ast.body.scopeId + "={};");
			else out.push("var " + this.ScopeId + "Stmt" + (this.StatementBlocks + 1) + "={};");
			
			out.push(this.currentLabel + "while(" + generate(ast.condition) + ")");
			
			if (ast.body.type != jsdef.BLOCK) {
				this.NewPseudoBlock(out, generate, ast, ast.body, true);
			}else {
				out.push(generate(ast.body));
			}
			
			ast.body.scopeId && out.push(this.ScopeId + ast.body.scopeId + "=null;");
			
			break;
		case jsdef.DO:
			ast.body.isLoop = true;
			if (ast.body.scopeId) out.push("var " + this.ScopeId + ast.body.scopeId + "={};");
			else out.push("var " + this.ScopeId + "Stmt" + (this.StatementBlocks + 1) + "={};");

			out.push(this.currentLabel + "do");
			
			if (ast.body.type != jsdef.BLOCK) {
				this.NewPseudoBlock(out, generate, ast, ast.body, true);
			}else {
				out.push(generate(ast.body));
			}
			
			out.push("while(" + generate(ast.condition) + ");");
			
			ast.body.scopeId && out.push(this.ScopeId + ast.body.scopeId + "=null;");
			
			break;
			
		//break/continue
		case jsdef.BREAK:
			this.breakStmt = "break";
			if (ast.label) this.breakStmt += " " + ast.label;
			this.breakStmt += ";";
			
			if (!this.inCase) {
				out.push(this.breakStmt);
				this.breakStmt = "";
			}
			
			break;
		case jsdef.CONTINUE:			
			this.continueStmt = "continue";
			if (ast.label) this.continueStmt += " " + ast.label;
			this.continueStmt += ";";
			
			if (!this.inCase) {
				out.push(this.continueStmt);
				this.continueStmt = "";
			}
			
			break;
			
		//Variable declarations
		case jsdef.VAR:
			this.TypeCheck(ast);
			
			var prefix = "", insideClass = this.InsideClass();
			
			if (ast.public) {
				if (ast.static) {
					out.push(prefix = this.AdjustedChainedClassName() + ".");
				}
				else {
					out.push(prefix = "this.");
				}
			}
			else if (ast.private) {
				out.push("var ");
			}
			else if (ast.protected) {
				out.push(prefix = "this.__PROTECTED__.");
			}
			else if (ast.static) {
				out.push(prefix = this.AdjustedChainedClassName() + ".");
			}
			else {
				out.push("var ");
			}
			
			//Destructuring assignment
			if (ast[0].type == jsdef.ARRAY_INIT) {
				if (ast[0].initializer && ast[0].initializer.type == jsdef.ARRAY_INIT) {
					if (ast[0].initializer.length != ast[0].length) {
						//Check the real length by looping and checking for
						//empty elements
						var len = ast[0].initializer.length;
						for (var item in ast[0].initializer) {
							if (!isFinite(item)) continue;
							
							if (ast[0].initializer[item].type == jsdef.VOID) {
								len--;
							}
						}
					
						if (ast[0].length >= len) {
							this.NewError({
								type: SyntaxError,
								message: "Invalid destructuring assignment: length mismatch"
							}, ast);
						}
					}
					
					//Loop identifiers and build array
					var ids = [];
					for (var item in ast[0]) {
						if (!isFinite(item)) continue;
						
						//Check that it's not void, etc.
						if (ast[0][item].type == jsdef.IDENTIFIER) {
							ids.push(ast[0][item].value);
						}
						else {
							ids.push(void 0);
						}
					}
					
					var tmp = this.CreateTempVar();
					out.push(tmp + "=" + generate(ast[0].initializer) + ";");
					var VarDecls = [];
					for (var i=0, len=ids.length; i<len; i++) {
						if (typeof ids[i] == "undefined") continue;
						
						VarDecls.push(ids[i] + "=" + tmp + "[" + i + "]");
					}
					VarDecls.length && out.push("var " + VarDecls.join(",") + ";");
				}
				//No initializer
				else if (!ast[0].initializer) {
					var vartype = this.types[ast[0].vartype]["default"], _out = [];
					for (var item in ast[0]) {
						if (!isFinite(item)) continue;
						
						_out.push(ast[0][item].value + "=" + vartype);
					}
					out.push(_out.join(",") + ";");
				}
				else {
					var tmp = this.CreateTempVar();
					out.push(tmp + "=" + generate(ast[0].initializer) + ";");
					
					var VarDecls = [], i = 0;
					for (var item in ast[0]) {
						if (!isFinite(item)) continue;
						
						//Check that it's not void, etc.
						if (ast[0][item].type == jsdef.IDENTIFIER) {
							VarDecls.push(ast[0][item].value + "=" + tmp + 
											"[" + i + "]");
						}
						
						i++;
					}
					
					VarDecls.length && out.push("var " + VarDecls.join(",") + ";");
				}
				
				break;
			}
			
			var id = "", varObject, varList = [], firstVar = true, reset = [],
				context = this.context, scope = this.ScopeJS(this.scopeChain.length-1);
				
			for (var item in ast) {
				if (!isFinite(item)) continue;
				
				varObject = {
					identifier: id = ast[item].value,
					properties: {},
					
					//Internal properties
					"[[ReadOnly]]": false,
					"[[DontEnum]]": false,
					"[[DontDelete]]": true,
					
					"[[Prototype]]": this.GetProto(ast[item].vartype),
					
					//Non-standard
					"[[Type]]": ast[item].vartype
				};
				
				//Assign initial value
				if (ast[item].initializer) {					
					varList.push({
						identifier: id,
						value: varObject.value = ast[item].initializer,
						type: ast[item].type || undefined
					});
				}else {
					varList.push({
						identifier: id,
						type: ast[item].vartype || undefined
					});
				}
				
				//Has this variable already been declared in the current context?
				for (var j=scope.Variables.length-1; j>=0; j--) {
					if (scope.Variables[j].identifier !== id) {
						continue;
					}else {
						this.NewWarning({
							type: SyntaxError,
							message: "Redeclaration of var " + id
						}, ast);
					}
				}
				
				if (insideClass) {
					(scope = this.CurrentClass()).Variables.push(varObject = {
						identifier: id,
						properties: {},
					
						//Standard internal properties
						"[[ReadOnly]]": false,
						"[[DontEnum]]": false,
						"[[DontDelete]]": true,
					
						//Non-standard internal properties
						"[[Type]]": ast[item].vartype,
						"[[Public]]": !!ast.public,
						"[[Private]]": !!ast.private,
						"[[Static]]": !!ast.static,
						"[[Protected]]": !!ast.protected,
						"[[ClassMember]]": true,
						"[[MemberOf]]": this.currentClass,
						"[[ClassId]]": this.CurrentClassScopeId()
					});
					
					if (ast.public) {
						this.classes[this.CurrentClassScopeId()].publicMembers.push(id);
					}
					else if (ast.protected) {
						this.classes[this.CurrentClassScopeId()].protectedMembers.push(id);
					}
					
					scope.Variables.push(context.ActivationObject[id] = varObject);
				}
				
				scope.Variables.push(context.ActivationObject[id] = varObject);
			}
			
			for (var i=0, len=varList.length, currentId = ""; i<len; i++) {
				if (!firstVar) {
					if (insideClass && prefix) {
						out.push(";" + prefix);
					}
					else {
						out.push(",");
					}
				}
				
				out.push(currentId = varList[i].identifier);
				
				if ("value" in varList[i]) {
					if (varList[i].value && varList[i].value.name === void 0) {
						//If it's a "class expression" (e.g. var foo = class {})
						//we need to assign the anonymous class a name
						if (varList[i].value.type == jsdef.CLASS) {
							varList[i].value.name = varList[i].identifier;
							
							varList[i].value.nestedParent = this.CurrentClass();
							
							varList[i].value.static = ast.static;
						}
						
						//Handle nested groups and calls for class var inits
						if (varList[i].value.type == jsdef.GROUP ||
							varList[i].value.type == jsdef.CALL) {
							//The following code will fix:
							//  private var foo = (function(){})()
							//and prevents it from becoming:
							//  (var undefined = ...)
							var reducedNode = this.reduceVarInit(varList[i].value);
							
							if (reducedNode) {
								reducedNode.name = varList[i].identifier;
								reducedNode.reduced = true;
							}
						}
						
						//Remove access modifiers so:
						//  private var foo = function(){};
						//doesn't become:
						// var foo = var undefined = function(){};
						if (varList[i].value.type == jsdef.FUNCTION) {
							varList[i].value.private = false;
							varList[i].value.public = false;
							varList[i].value.protected = false;
							varList[i].value.static = false;
							varList[i].value.body.static = ast.static;
						}
					}

					out.push("=" + generate(varList[i].value));
				}
				else if (typeof varList[i].type == "string" &&
						 this.types.hasOwnProperty(varList[i].type)) {
					out.push("=" + this.types[varList[i].type]["default"]);
				}
				else if (insideClass) {
					out.push("=undefined");
				}
				
				//Has this variable already been declared in the block?
				if (scope.map_BlockVars.hasOwnProperty(currentId)) {
					//Redeclare variable in function scope
					reset.push(this.ScopeId + this.CurrentScope().scopeId + "['" +
								scope.map_BlockVars[currentId] + "']=undefined;");
					delete scope.map_BlockVars[currentId];
					this.LookupScopeChain(currentId, this.scopeChain.length-2,
						function(find) {
							var newScope = _this.scopes[find.scopeId];
							
							if (find.isBlockVariable) {
								delete newScope.map_BlockVars[currentId];
								newScope.Variables.push(
									context.ActivationObject[currentId] = varList[i]
								);
							}
						}
					);
					
					//Throw a warning
					this.NewWarning({
						type: SyntaxError,
						message: "Redeclaration of let " + currentId
					}, ast);
				}
				
				firstVar = false;
			}
			out.push(";");
			out = out.concat(reset);
			
			break;
		case jsdef.CONST:
			break;
		case jsdef.LET:
			this.TypeCheck(ast);
			
			var id = "", varObject, varList = [], oid = "";
			for (var item in ast) {
				if (!isFinite(item)) continue;
				
				oid = ast[item].value;
				context = this.context;
				
				scope = this.CurrentScope();//this.scopes[ast.scopeId];
				
				//Rename identifier
				if (scope.map_BlockVars[oid] === undefined) {
					var nextVar = 
						+context.NextBlockVariable[context.NextBlockVariable.length - 1] + 1;
					//Greater than z, jump to A
					if (nextVar > 123) {
						context.NextBlockVariable[context.NextBlockVariable.length-1] = 65;
					}
					//Greater than Z, but less than a
					else if (nextVar > 91 && nextVar < 97) {
						context.NextBlockVariable[context.NextBlockVariable.length-1]--;
						context.NextBlockVariable.push(97);
					}
					id = context.NextBlockVariable.map(function(x){
						return String.fromCharCode(x)
					}).join("");
					context.NextBlockVariable[context.NextBlockVariable.length-1]++;
				}
				//Re-declare/re-assign block-scoped variable
				else {
					id = scope.map_BlockVars[oid];
					
					this.NewWarning({
						type: SyntaxError,
						message: "Redeclaration of let " + oid
					}, ast);
				}
				
				varObject = {
					identifier: scope.map_BlockVars[oid] = id,
					properties: {},
					
					//Internal properties
					"[[ReadOnly]]": false,
					"[[DontEnum]]": false,
					"[[DontDelete]]": true,
					
					//Non-standard
					"[[Type]]": ast[item].vartype,
					"[[Block]]": true
				};
				
				//Assign initial value
				if (ast[item].initializer) {					
					varList.push({
						identifier:id,
						_previousIdentifier: oid,
						value: varObject.value = ast[item].initializer
					});
				}else {
					varList.push({
						identifier:id,
						_previousIdentifier: oid
					});
				}
				
				for (var i=0, len=scope.BlockVariables.length; i<len; i++) {
					if (scope.BlockVariables[i].identifier === id) {
						break;
					}
				}
				
				if (i === scope.BlockVariables.length) {
					scope.BlockVariables.push(
						context.ActivationObject[id] = varObject
					);
				}
			}

			for (var i=0, len=varList.length, currentId = ""; i<len; i++) {
				out.push(this.ScopeId + this.CurrentScope().scopeId + ".");
				out.push(currentId = varList[i].identifier);
				
				if (varList[i].hasOwnProperty("value")) {
					if (varList[i].value && varList[i].value.name === undefined) {
						
						//If it's a "class expression" (e.g. var foo = class {})
						//we need to assign the anonymous class a name
						if (varList[i].value.type == jsdef.CLASS) {
							varList[i].value.name = varList[i].identifier;
							
							varList[i].value.nestedParent = this.CurrentClass();
							
							varList[i].value.static = ast.static;
						}
						
						//Remove access modifiers so:
						//  private var foo = function(){};
						//doesn't become:
						//  var foo = var undefined = function(){};
						if (varList[i].value.type == jsdef.FUNCTION) {
							varList[i].value.private = false;
							varList[i].value.public = false;
							varList[i].value.protected = false;
							varList[i].value.static = false;
							varList[i].value.body.static = ast.static;
						}
					}
					
					out.push("=" + generate(varList[i].value));
				}
				else out.push("=undefined");
				
				out.push(";");
				
				//Has this variable already been declared in the execution context?
				for (var j=scope.Variables.length-1; j>=0; j--) {
					if (!scope.Variables[j] || 
						scope.Variables[j].identifier !== varList[i]._previousIdentifier) {
						continue;
					}
				
					//Redeclare variable in block scope
					//scope.map_BlockVars[currentId] = generate(varList[i].value); //Causing infinite loop
					scope.Variables.splice(j++, 1);
					out.push(varList[i]._previousIdentifier + "=undefined;");
					
					//Throw a warning
					this.NewWarning({
						type: SyntaxError,
						message: "Redeclaration of var " + 
									varList[i]._previousIdentifier
					}, ast);
				}
			}
			
			break;
		case jsdef.IDENTIFIER:
			scope = this.CurrentScope();
			
			//Needs to come before "isMember" check
			if (ast.value == "super" && this.CurrentClass()) {
				out.push("__SUPER__");
				break;
			}
			
			//Member of an object
			if (ast.isMember) {
				out.push(ast.value);
				break;
			}
			
			//"args" array
			if (ast.value == "args") {
				var currentFunc = this.CurrentFunction(this.scopeChain.length-1);
				if (currentFunc) currentFunc.usesArgs = true;
			}
			
			//Variable is defined inside the current block
			if (scope.map_BlockVars.hasOwnProperty(ast.value)) {
				out.push(this.ScopeId + this.CurrentScope().scopeId + 
							"." + 
							scope.map_BlockVars[ast.value]
						);
			}
			//Look up the scope chain for variable definition
			else {
				var findIdentifier = ast.value, scopeChain = this.scopeChain;
				
				var currentClass = this.CurrentClass(), skipLookup = false;
				//Don't lookup variables for static methods and classes
				if (scope.static || this.InsideStaticMember()) {
					skipLookup = true;
				}
				
				skipLookup && out.push(findIdentifier);
				
				!skipLookup && this.LookupScopeChain(findIdentifier, this.scopeChain.length-1,
					function (find) {
						//Found the variable
						if (find) {
							//Found variable is local to block
							if (find.isBlockVariable) {
								var GetScopeId = _this.ScopeId + find.scopeId;
								out.push(GetScopeId + 
									"." + 
									_this.scopes[find.scopeId].map_BlockVars[findIdentifier]);
							}
							//Handle class members
							else if (find.isClassMember && _this.classScopes.length) {
								if (find.data["[[Static]]"]) {
									if (find.data["[[Private]]"]) {
										out.push(findIdentifier);
									}
									else if (find.data["[[Protected]]"]) {
										out.push("__CLASS" + find.data["[[ClassId]]"] + "__." + 
												 "__PROTECTED__." + findIdentifier);
									}
									else {
										out.push(find.data["[[MemberOf]]"] + "." + 
												 findIdentifier);
									}
								}
								else if (find.data["[[Public]]"]) {
									out.push("__CLASS" + find.data["[[ClassId]]"] + "__." + findIdentifier);
								}
								else if (find.data["[[Protected]]"]) {
									out.push("__CLASS" + find.data["[[ClassId]]"] +
											 "__." + "__PROTECTED__." + findIdentifier);
								}
								else {
									out.push(findIdentifier);
								}
							}
							//Found variable is declared elsewhere
							else {
								out.push(findIdentifier);
							}
						}
						//Couldn't find variable declaration
						else {
							var inheritedMember = false, currentClass = _this.CurrentClass();
							
							//Check for inherited class
							if (currentClass && currentClass.extends) {
								
								var i,
									foundSuper = false,
									currentItem,
									currentChainItem = currentClass.body.scopeId,
									counter = 1;
								
								while( currentChainItem &&
									  (currentItem = _this.classes[currentChainItem])
									 ) {
									if (~currentItem.protectedMembers.indexOf(findIdentifier)) {
										out.push(
											"__CLASS" + _this.CurrentClassScopeId() + "__." +
											(new Array(counter)).join("__SUPER__.") + 
											"__PROTECTED__." + findIdentifier
										);
										
										inheritedMember = true;
										break;
									}
									else if (~currentItem.publicMembers.indexOf(findIdentifier)) {
										out.push(
											"__CLASS" + _this.CurrentClassScopeId() + "__." +
											(new Array(counter)).join("__SUPER__.") + 
											findIdentifier
										);
										
										inheritedMember = true;
										break;
									}
								
									//Keep looking up inheritance chain
									if (currentItem.__SUPER__) for (var i in _this.classes) {
										if (isFinite(i) && 
											_this.classes[i].id == currentItem.__SUPER__) {
											currentChainItem = i;
											foundSuper = true;
											break;
										}
									}
									
									if (!foundSuper) break;
									else {
										foundSuper = false;
										counter++;
									}
								}
							}
							
							if (!inheritedMember) {
								!_this.isObjProperty && _this.NewWarning({
									type: ReferenceError,
									message: "Variable '" + findIdentifier + 
												"' has not been declared"
								}, ast);
						
								out.push(findIdentifier);
							}
						}
				});
			}
			break;
			
		//Accessors
		case jsdef.INDEX:
			out.push(generate(ast[0]));
			out.push("[");
			out.push(generate(ast[1]));
			out.push("]");
			break;
		case jsdef.DOT:
			out.push(generate(ast[0]));
			out.push(".");
			//Denote object member to prevent compiler warnings
			if (ast[1].type == jsdef.IDENTIFIER) {
				ast[1].isMember = true;
			}
			out.push(generate(ast[1]));
			break;
			
		//Assignment
		case jsdef.ASSIGN:
			this.TypeCheck(ast);
			
			if (ast[0].type == jsdef.THIS) {
				this.NewError({
					type: ReferenceError,
					message: "Cannot assign to 'this'"
				}, ast);
			}
			else if (ast[0].type == jsdef.ARRAY_INIT) {
				//Destructuring assignment
				if (ast.value == "=") {				
					if (ast[0].length > ast[1].length) {
						this.NewError({
							type: SyntaxError,
							message: "Invalid destructuring assignment: length mismatch"
						}, ast);
					}
						
					var tmp = this.CreateTempVar();
					
					out.push("var " + tmp + "=" + generate(ast[1]) + ";");
					
					for (var item in ast[0]) {
						if (!isFinite(item) || ast[0][item].type != jsdef.IDENTIFIER) continue;
						
						out.push(ast[0][item].value + "=" + tmp + "[" + (+item) + "];");
					}
					
					break;
				}
				//Array operators (e.g. [1,2,3] *= 2 -> [2,4,6])
				else {
					var initializer = generate(ast[0]);
					var modifier = generate(ast[1]);
					out.push("(function(){for(var i=0,a=" + initializer + ",l=a.length;i<l;i++){");
					out.push("a[i]=a[i]" + ast.value + modifier + ";");
					out.push("}return a})()");
				}
				break;
			}
			else if (ast[0].type != jsdef.IDENTIFIER &&
					 ast[0].type != jsdef.DOT &&
					 ast[0].type != jsdef.INDEX) {
				this.NewError({
					type: ReferenceError,
					message: "Invalid left-hand assignment"
				}, ast);
			}
			
			//TODO: If it's the dot operator or index, assign the property
			scope = this.CurrentScope();
			/*if (ast[0].type == jsdef.DOT) {
				var find = ast[0][0].value;
				for (var j=scope.Variables.length-1; j>=0; j--) {
					if (!scope.Variables[j] || 
						scope.Variables[j].identifier !== find) {
						continue;
					}
					
					scope.Variables[j].properties[generate(ast[0][1])] = {
						properties: {},
						identifier: ast[0][1].value
					};
					break;
				}
				break;
			}
			else if (ast[0].type == jsdef.INDEX) {
			}*/
			
			var id = generate(ast[0]);
			out.push(id);
			
			if (ast.value == "=") {
				out.push(ast.value);
			}
			else {
				//Logical assignment operators
				if (ast.value == "&&" || ast.value == "||") {
					out.push("=" + id + ast.value);
				}
				//Exponent operator
				else if (ast.value == "**") {
					out.push("=Math.pow(" + id + "," + generate(ast[1]) + ")");
					break;
				}
				//Existential operator
				else if (ast.value == "?") {
					out.push("=" + id + "==null?" + generate(ast[1]) + ":" + id);
					break;
				}
				else {
					out.push(ast.value + "=");
				}
			}
			
			out.push(generate(ast[1]));
			break;
			
		//Statements
		case jsdef.SEMICOLON:
			//Ternary is used to avoid infinite loops
			out.push((ast.expression ? generate(ast.expression) : "") + ";");
			break;
		case jsdef.EXTENSION:
			var base = generate(ast.object) + "."; //Base object
			var ext = this.GetCurrentContext().Extensions, _name = "";
			
			for (var item in ast.extend) {
				if (!isFinite(item)) continue;
				
				ext.push(_name = base + generate(ast.extend[item][0]));
				
				out.push(_name + "=");
				out.push(generate(ast.extend[item][1]) + ";");
			}
			
			break;
			
		//Arithmetic Operators
		case jsdef.PLUS:
			out.push(generate(ast[0]));
			out.push("+");
			out.push(generate(ast[1]));
			break;
		case jsdef.MINUS:
			out.push(generate(ast[0]));
			out.push("-");
			out.push(generate(ast[1]));
			break;
		case jsdef.MUL:
			out.push(generate(ast[0]));
			out.push("*");
			out.push(generate(ast[1]));
			break;
		case jsdef.DIV:
			out.push(generate(ast[0]));
			out.push("/");
			out.push(generate(ast[1]));
			break;
		case jsdef.MOD:
			out.push(generate(ast[0]));
			out.push("%");
			out.push(generate(ast[1]));
			break;
		case jsdef.EXPONENT:
			//Optimize the code if both sides are numeric literals
			if (ast[0].type == jsdef.NUMBER && ast[1].type == jsdef.NUMBER) {
				var exp = [];
				for (var i=0, len=ast[1].value; i<len; i++) {
					exp.push(ast[0].value);
				}
				out.push(exp.join("*"));
			}
			//Otherwise, just use Math.pow
			else {
				out.push("Math.pow(" + generate(ast[0]) + "," + generate(ast[1]) + ")");
			}
			break;
		case jsdef.INCREMENT:
			if (ast.postfix) {
				out.push(generate(ast[0]));
				out.push("++");
			}
			else {
				out.push("++");
				out.push(generate(ast[0]));
			}
			break;
		case jsdef.DECREMENT:
			if (ast.postfix) {
				out.push(generate(ast[0]));
				out.push("--");
			}
			else {
				out.push("--");
				out.push(generate(ast[0]));
			}
			break;
			
		//Unary operators
		case jsdef.UNARY_PLUS:
			out.push(" +");
			out.push(generate(ast[0]));
			break;
		case jsdef.UNARY_MINUS:
			out.push(" -");
			out.push(generate(ast[0]));
			break;
			
		//Bitwise operators
		case jsdef.BITWISE_AND:
			out.push(generate(ast[0]));
			out.push("&");
			out.push(generate(ast[1]));
			break;
		case jsdef.BITWISE_OR:
			out.push(generate(ast[0]));
			out.push("|");
			out.push(generate(ast[1]));
			break;
		case jsdef.BITWISE_XOR:
			out.push(generate(ast[0]));
			out.push("^");
			out.push(generate(ast[1]));
			break;
		case jsdef.BITWISE_NOT:
			out.push("~");
			out.push(generate(ast[0]));
			break;
		case jsdef.LSH:
			out.push(generate(ast[0]));
			out.push("<<");
			out.push(generate(ast[1]));
			break;
		case jsdef.RSH:
			out.push(generate(ast[0]));
			out.push(">>");
			out.push(generate(ast[1]));
			break;
		case jsdef.URSH:
			out.push(generate(ast[0]));
			out.push(">>>");
			out.push(generate(ast[1]));
			break;
			
		//Comparison Operators
		case jsdef.EQ:
			out.push(generate(ast[0]));
			out.push("==");
			out.push(generate(ast[1]));
			break;
		case jsdef.NE:
			out.push(generate(ast[0]));
			out.push("!=");
			out.push(generate(ast[1]));
			break;
		case jsdef.STRICT_EQ:
			out.push(generate(ast[0]));
			out.push("===");
			out.push(generate(ast[1]));
			break;
		case jsdef.STRICT_NE:
			out.push(generate(ast[0]));
			out.push("!==");
			out.push(generate(ast[1]));
			break;
		case jsdef.GT:
			out.push(generate(ast[0]));
			out.push(">");
			out.push(generate(ast[1]));
			break;
		case jsdef.GE:
			out.push(generate(ast[0]));
			out.push(">=");
			out.push(generate(ast[1]));
			break;
		case jsdef.LT:
			out.push(generate(ast[0]));
			out.push("<");
			out.push(generate(ast[1]));
			break;
		case jsdef.LE:
			out.push(generate(ast[0]));
			out.push("<=");
			out.push(generate(ast[1]));
			break;
			
		//Logical operators
		case jsdef.AND:
			out.push(generate(ast[0]));
			out.push("&&");
			out.push(generate(ast[1]));
			break;
		case jsdef.OR:
			out.push(generate(ast[0]));
			out.push("||");
			out.push(generate(ast[1]));
			break;
		case jsdef.NOT:
			out.push("!");
			out.push(generate(ast[0]));
			break;
			
		//Literals
		case jsdef.TRUE:
			out.push("true");
			break;
		case jsdef.FALSE:
			out.push("false");
			break;
		case jsdef.STRING:
			//Multi-line strings/heredocs
			if (Array.isArray(ast.value)) {
				out.push('"');
				
				//Determine spacing on first line
				var _indent = /^\s+/.exec(ast.value[0]), indent = "";
				if (_indent && _indent.length && _indent[0]) {
					indent = _indent[0];
				}
				
				var re = /^\s+/; //Prevent re-instantiation every loop
				for (var i=0, len=ast.value.length, _re, space = "", width = 0; i<len; i++) {
					space = "";
					width = 0;
					_re = re.exec(ast.value[i]);
					
					if (_re && _re.length && _re[0]) {
						space = _re[0];
					}
					
					width = space.length - indent.length;
					if (width > 0) {
						out.push(JSON.stringify(ast.value[i].replace(
							RegExp("^\\s{" + width + "}"), "")).replace(/^['"]|['"]$/gm, ""));
					}
					else {
						out.push(
							JSON.stringify(ast.value[i]).
								replace(/^['"]|['"]$/gm, "").
								replace(/\\\\([A-Za-z])/gm, "\\$1")
							);
					}
					
					out.push("\\n");
				}
				out.pop(); //pop the last \n
				
				out.push('"');
			}
			else {
				out.push('"' + ast.value + '"');
				//out.push(JSON.stringify(ast.value.replace(/\\\r?\n/gm, "\n").replace(/\\(.)/gm, "$1")));
			}
			break;
		case jsdef.NUMBER:
			out.push(ast.value);
			break;
			
		//Try/catch/finally/throw
		case jsdef.TRY:
			out.push("try");
			out.push(generate(ast.tryBlock));
			for (var catchClause in ast.catchClauses) {
				if (!isFinite(catchClause)) continue;
				
				out.push("catch(" + ast.catchClauses[catchClause].varName + ")");
				out.push(generate(ast.catchClauses[catchClause].block));
				
				ast.finallyBlock && out.push("finally" + generate(ast.finallyBlock));
			}
			break;
		case jsdef.THROW:
			out.push("throw ");
			out.push(generate(ast.exception));
			out.push(";");
			break;
		
		//Miscellaneous
		case jsdef.THIS:
			if (this.currentClass) {
				out.push(this.classId);
			}
			else {
				out.push("this");
			}
			break;
		case jsdef.HOOK: //Ternary
			out.push(generate(ast[0]));
			out.push("?");
			out.push(generate(ast[1]));
			out.push(":");
			out.push(generate(ast[2]));
			break;
		case jsdef.DELETE:
			out.push("delete ");
			out.push(generate(ast[0]));
			break;
		case jsdef.IN:
			out.push(generate(ast[0]));
			out.push(" in ");
			out.push(generate(ast[1]));
			break;
		case jsdef.INSIDE:
			out.push("Object.prototype.hasOwnProperty.call(");
			out.push(generate(ast[1]) || "this");
			out.push(",");
			out.push(generate(ast[0]));
			out.push(")");
			break;
		case jsdef.INSTANCEOF:
			out.push(generate(ast[0]));
			out.push(" instanceof ");
			out.push(generate(ast[1]));
			break;
		case jsdef.NEW:
			out.push("new ");
			out.push(generate(ast[0]));
			break;
		case jsdef.NEW_WITH_ARGS:
			out.push("new ");
			out.push(generate(ast[0]));
			out.push("(");
			out.push(generate(ast[1]));
			out.push(")");
			break;
		case jsdef.TYPEOF:
			out.push("typeof ");
			out.push(generate(ast[0]));
			break;
		case jsdef.VOID:
			out.push("void ");
			out.push(generate(ast[0]));
			break;
		case jsdef.UNARY_EXISTS:
			if (ast[0].type == jsdef.IDENTIFIER) {
				var id = generate(ast[0]);
				out.push("(typeof " + id + "!='undefined'&&" + id + "!==null)");
			}
			else {
				//We still have to wrap in parens due to object literals {} 
				//being treated as blocks otherwise
				out.push("(" + generate(ast[0]) + "!=null)");
			}
			
			break;
		case jsdef.REGEXP:
			//Ignore whitespace?
			if (ast.value[0] == "x") {
				ast.value[2] = ast.value[2].replace(/\s+|#.*/gm, "");
			}
			//Throw a warning if there's newlines without free spacing mode
			else if (/[\r\n]/.test(ast.value[2])) {
				this.NewWarning({
					type: SyntaxError,
					message: "Whitespace detected in regular expression pattern" +
								" without free spacing mode enabled."
				}, ast);
			}
		
			//Regular regex delimiter
			if (ast.value[1] == "/") {
				try {
					out.push(RegExp(ast.value[2]) + ast.value[3]);
				}catch(e) {
					//Catch malformed regex patterns, etc.
					this.NewError({
						type: e.constructor,
						message: e.message
					}, ast);
				}
			}
			//Custom regex delimiter
			else {
				var rePattern = ast.value[2].replace(/\//gmi, "\\/");
				
				//Catch malformed regex patterns, etc.
				try {
					RegExp(rePattern);
					out.push("/" + rePattern + "/" + ast.value[3]);
				}catch(e) {
					//Catch malformed regex patterns, etc.
					this.NewError({
						type: e.constructor,
						message: e.message
					}, ast);
				}
			}
			break;
		case jsdef.ARRAY_INIT:
			out.push("[");
			var firstItem = true;
			
			function NumberRange(x, y, z) {
				var ret = [];
				
				if (x <= y) {
					for (; x <= y; x++) {
						ret.push(x);
					}
				}
				//Reverse range; ex. [20...1]
				else {
					for (; x >= y; x--) {
						ret.push(x);
					}
				}
				
				return "[" + ret.join(",") + "]";
			}
			
			function CharRange(x, y) {
				var ret = [];
				
				x = x.charCodeAt(0);
				y = y.charCodeAt(0);
				
				var chara = "";
				
				if (x <= y) {
					for (; x <= y; x++) {
						chara = String.fromCharCode(x);
						
						/^[A-Za-z]$/.test(chara) && ret.push('"' + chara + '"');
					}
				}
				//Reverse range; ex. [20...1]
				else {
					for (; x >= y; x--) {
						chara = String.fromCharCode(x);
						
						/^[A-Za-z]$/.test(chara) && ret.push('"' + chara + '"');
					}
				}
				
				return "[" + ret.join(",") + "]";
			}
			
			//Numeric range; ex. [1...20]
			if (ast[0] && ast[0].type == jsdef.RANGE) {
				//Regular numeric ranges; ex. [1...10]
				if (ast[0][0].type == jsdef.NUMBER && ast[0][1].type == jsdef.NUMBER) {
					return NumberRange(ast[0][0].value, ast[0][1].value);
				}
				//Numeric ranges with unary operators; ex. [-1...20]
				else if (ast[0][0].type == jsdef.UNARY_PLUS ||
						 ast[0][0].type == jsdef.UNARY_MINUS ||
						 ast[0][1].type == jsdef.UNARY_PLUS ||
						 ast[0][1].type == jsdef.UNARY_MINUS) {
					var x, y;
					if (ast[0][0].type == jsdef.UNARY_PLUS ||
						ast[0][0].type == jsdef.UNARY_MINUS) {
						if (ast[0][0][0].type == jsdef.NUMBER) {
							x = ast[0][0][0].value;
						}
						else {
							this.NewError({
								type: RangeError,
								message: "Invalid range"
							}, ast);
						}
					}
					else {
						if (ast[0][0].type == jsdef.NUMBER) {
							x = ast[0][0].value;
						}
						else {
							this.NewError({
								type: RangeError,
								message: "Invalid range"
							}, ast);
						}
					}
					if (ast[0][1].type == jsdef.UNARY_PLUS ||
						ast[0][1].type == jsdef.UNARY_MINUS) {
						if (ast[0][1][0].type == jsdef.NUMBER) {
							y = ast[0][1][0].value;
						}
						else {
							this.NewError({
								type: RangeError,
								message: "Invalid range"
							}, ast);
						}
					}
					else {
						if (ast[0][1].type == jsdef.NUMBER) {
							y = ast[0][1].value;
						}
						else {
							this.NewError({
								type: RangeError,
								message: "Invalid range"
							}, ast);
						}
					}
						
					if (ast[0][0].type == jsdef.UNARY_MINUS) {
						x = -x;
					}
					if (ast[0][1].type == jsdef.UNARY_MINUS) {
						y = -y;
					}
					
					return NumberRange(x, y);
				}
				//Character ranges; ex. ["a"..."z"]
				//JS++ character range ["A"..."z"] will only be [A-Za-z] unlike regex
				else if (ast[0][0].type == jsdef.STRING && ast[0][1].type == jsdef.STRING) {
					//Test for valid ranges
					if (/^[A-Za-z]$/.test(ast[0][0].value) ||
						/^[A-Za-z]$/.test(ast[0][1].value)) {
						return CharRange(ast[0][0].value, ast[0][1].value);
					}
					else {
						this.NewError({
							type: RangeError,
							message: "Invalid range"
						}, ast);
					}
				}
				else {
					this.NewError({
						type: RangeError,
						message: "Invalid range"
					}, ast);
				}
			}
			//Regular array initializer
			else {
				for (var item in ast) {
					if (!isFinite(item)) continue;
				
					if (!firstItem) out.push(",");
				
					out.push(generate(ast[item]));
				
					firstItem = false;
				}
			}
			out.push("]");
			break;
		case jsdef.RANGE:
			this.NewError({
				type: RangeError,
				message: "Invalid range"
			}, ast);
			break;
		case jsdef.ARRAY_COMP:
			var _out = [], it = "";
			var count = 0; //count conditionals
			var tmp = "", ret = this.CreateTempVar();
			for (var item in ast) {
				if (!isFinite(item) || item === "0" || item === 0) continue;
				
				tmp = this.CreateTempVar();
				
				//for-in and for-inside loops
				if (ast[item].type == jsdef.FOR_IN || ast[item].type == jsdef.FOR_INSIDE) {
					if (ast[item].iterator.type == jsdef.LET) {
						_out.push("for(var " + (it = ast[item].iterator[0].value) + " in ");
						ast[item].type == jsdef.FOR_INSIDE && _out.push(tmp + "=");
						_out.push(generate(ast[item].object) + "){");
						
						count++;
					}
					else if (ast[item].iterator.type == jsdef.VAR) {
						_out.push("for(var " + (it = ast[item].iterator[0].value) + " in ");
						ast[item].type == jsdef.FOR_INSIDE && _out.push(tmp + "=");
						_out.push(generate(ast[item].object) + "){");
						
						count++;
					}
					else { //jsdef.IDENTIFIER
						_out.push("for(" + (it = generate(ast[item].iterator)) + " in ");
						ast[item].type == jsdef.FOR_INSIDE && _out.push(tmp + "=");
						_out.push(generate(ast[item].object) + "){");
						
						count++;
					}
					
					if (ast[item].type == jsdef.FOR_INSIDE) {
						_out.push("if(Object.prototype.hasOwnProperty.call(" + tmp + "," + it + ")){");
						
						count++;
					}
				}
				//if statements
				else if (ast[item].type == jsdef.IF) {
					_out.push("if(" + generate(ast[item].condition) + "){");
					
					count++;
				}
			}
			_out.push(ret + ".push(" + generate(ast[0]) + ")"); //Body
			while (count > 0) (_out.push("}"), --count); //Add closing braces
			
			out.push("(function(){var " + ret + "=[];");
			
			out = out.concat(_out);
			
			out.push("return " + ret + "})()");
			
			break;
		case jsdef.OBJECT_INIT:
			this.TypeCheck(ast);
			
			scope = this.CurrentScope();
			
			out.push("{");			
			for (var item in ast) {
				if (!isFinite(item)) continue;
				
				var find, props, propsChain = [ast[item][0].value], currentProp, vartype;
				
				//Do the code generation before we add type annotations into
				//Variables object because the PROPERTY_INIT will trigger
				//the type system which resolves the type of each property
				if (ast.parentProperty) ast[item].parentProperty = ast.parentProperty;
				else ast[item].parentObject = ast;
				
				out.push(generate(ast[item]));
				
				vartype = ast[item][1]["[[Type]]"];
				
				if (ast.parentProperty) {
					find = ast.parentProperty;
					propsChain.push(find[0].value);
					
					while (find && (find.parentProperty || find.parentObject)) {
						if (find.parentProperty) {
							find = find.parentProperty;
							propsChain.push(find[0].value);
						}
						else {
							find = find.parentObject;
							break;
						}
					}
					
					find = find.assignedTo;
				}else {
					find = ast.assignedTo;
				}
				
				//Now that we know the property type, loop through Variables object
				for (var j=scope.Variables.length-1; j>=0; j--) {
					if (!scope.Variables[j] || 
						scope.Variables[j].identifier !== find) {
						continue;
					}
					
					props = scope.Variables[j].properties;
					
					while(propsChain.length) {
						currentProp = propsChain.pop();
						
						if (props[currentProp]) {
							//This is a bit of a hack, but at least the [[Type]]
							//property will be set correctly
							props[currentProp]["[[Type]]"] = vartype;
							props[currentProp]["[[Prototype]]"] = this.GetProto(vartype);
						}
						else {
							props[currentProp] = props[currentProp] || {
								"[[Type]]": vartype,
								"[[Prototype]]": this.GetProto(vartype),
						
								properties: {}
							};
							
							if (vartype == "Function") {
								props[currentProp].properties.prototype = {
									"[[Type]]": "Object",
									"[[Prototype]]": this.GetProto("Object"),
									
									properties: {}
								};
							}
						}
					
						props = props[currentProp].properties;
					}
					
					break;
				}
				
				out.push(",");
			}
			out[out.length-1] == "," && out.pop(); //Pop the last comma
			out.push("}");
			
			break;
		case jsdef.PROPERTY_INIT:
			this.TypeCheck(ast);
			
			this.isObjProperty = true;
			out.push(generate(ast[0]) + ":");
			this.isObjProperty = false;
			if (ast[1].type == jsdef.OBJECT_INIT) {
				ast[1].parentProperty = ast;
				ast[1].parentProperty.name = ast[0].value;
			}
			out.push(generate(ast[1]));
			
			break;
		case jsdef.LABEL:
			if (ast.statement && !ast.statement.isLoop) {
				out.push(ast.label + ":");
				this.currentLabel = "";
			}
			else {
				this.currentLabel = ast.label + ":";
			}
			
			out.push(generate(ast.statement));
			
			this.currentLabel = "";
			
			break;
		case jsdef.WITH:
			out.push("with(" + generate(ast.object) + ")");
			out.push(generate(ast.body));
			break;
		case jsdef.NULL:
			out.push("null");
			break;
		case jsdef.DEBUGGER:
			out.push("debugger;");
			break;
			
		//Pre-processor directives - throw warnings
		case jsdef.TYPESYS:
			this.NewWarning({
				type: SyntaxError,
				message: "Pre-processor directives must be at the top of the file."
			}, ast);
			break;
		
		default:
			break;
	}
	
	return out.join("");
};

compiler.prototype.preprocess = function(ast) {
	var node, _node;
	
	ast = ast || this.ast;
	
	descend: for (var item in ast) {
		if (!isFinite(item)) continue;
		
		_node = ast[item];
		if (_node.type != jsdef.SEMICOLON) break descend;
		node = _node.expression;
		
		switch(node.type) {
			case jsdef.TYPESYS:
				if (node[0].type == jsdef.IDENTIFIER || node[0].type == jsdef.STRING) {				
					if (node[0].value == "none" || node[0].value == "None") {
						this.typeSystem = null;
					}
					else if (this.typesys[node[0].value]) {
						this.typeSystem = new this.typesys[node[0].value];
					}
					else {
						this.NewWarning({
							type: SyntaxError,
							message: "Non-existant type system: " + node[0].value
						}, node);
					}
				}
				else {
					this.NewWarning({
						type: SyntaxError,
						message: "Invalid type system."
					}, node);
				}
				
				delete ast[item];
		
				break;
			default:
				break descend;
		}
	}
	
	return ast;
};

this.compiler = compiler;
//Strong, static typing system for JavaScript++
//Copyright (c) 2011 by Roger Poon

//Types need to be declared:
//  var a as Number;
//  let b as String = "foo";
//  var c; //Error - missing type declaration
//
//Object properties are inferred on declaration:
//  var myObject = {
//    foo: "foo", //String
//    bar: 1 //Number
//  };
//
//If a property's not declared, throws an error.  To declare an object
//property without object literal, use:
//  myObject.baz = 2; //inferred as Number
//or
//  this.baz = "baz"; //inferred as String
//The *first* assignment to a property is the declaration
//
//Currently, ignoring dynamic property assignments:
//  var a = {}, xhrData as String = xhrData();
//  a[xhrData] = 1;
//Compiler will throw a warning but not an error
//
//Arrays can only carry elements of one type, declare like so:
//  var strArray as String[] = ["foo", "bar", "baz"]; //Type can be inferred for arrays
//  strArray.push(1); //TypeError
//  ["foo", 1, "bar"].filter(...) //TypeError, type is inferred here
//
//Type casting occurs with constructor functions:
//  var a as String = String(1);
//  var b as Number = String(1); //TypeError
//  var c as String[] = StringArray(1, "2", 3); //StringArray converts each item to string
//  var d as Array[]; //Array of arrays
//    var e as String[];
//    d.push(e);
//
//Note that arrays of arrays are not arrays of untyped arrays:
//  var foo as Array[] = ArrayArray(StringArray(), NumberArray()); //OK
//  var foo as Array[] = ArrayArray([]); //TypeError
//
//Functions must declare a return type:
//  function foo as String() { ... }
//  function foo() {} //TypeError
//Anonymous functions can be declared like so:
//  [1, 2, 3].filter(function as Boolean(){ return true })
//Function expressions can also be declared like so:
//  var foo as Function = function as String() {};
//
//If a function is overloaded with different return types, it gets implicitly 
//converted when called
//  function foo as String(){}
//  function foo as Number(){}
//  var bar as String = foo(); //Implicitly calls the foo that returns a String
//
//Classes can be used as types
//  class foo {}
//  var bar as foo = new foo();
//
//"#typesys less_strict" is a fork of strict and allows:
//Functions can have multiple return types to keep syntax terse:
//  function foo as [String, Number]() {}
//  var bar as String = foo(); //Infers foo() as String
//  var baz as Boolean = foo(); //TypeError
//
//And variables can have multiple types:
//  var qux as [String, Boolean] = true;
//  var quux = "foo";
//
//But it has the same implicit conversion rules as "strict" and, for example,
//doesn't allow adding strings and numbers:
//  var widget = 1 + "1"; //TypeError
//  var myArray = ["foo", 1]; //And no generic untyped arrays either
//
//The motivation behind #typesys less_strict is for libraries that may have 
//multiple return types and want to condense their code.  Yes, we can use type 
//inference, but that's not ideal for IDE's.

compiler.prototype.typesys.strict = function() {
	//Setup the type rules
	this.typerules = {
		//Type casting
		explicit: {
			"__UNARY__": ["Boolean", "Number", "String"],
			"Array": [],
			"Boolean": ["Number", "String"],
			"Date": ["Number", "String"],
			"Function": ["String"],
			"null": [],
			"Number": ["Boolean", "String"],
			"Object": [],
			"RegExp": ["Boolean", "Date", "Number", "String"],
			"String": ["Boolean", "Date", "Function", "Number", "RegExp"]
		},

		//Implicit type coercion - which types do we allow for PLUS/MINUS/MUL/DIV/MOD and bit shifts?
		//Format:
		//  implicit: {
		//      OPERATOR: {
		//          Type1: {
		//              Type2: "Result of operator applied to Type1 and Type2"
		//          }
		//      }
		//  }
		//
		//  If a = b, then b = a; tedious, but that means each new rule needs to be added to both "a" and "b:"
		//  PLUS: {
		//    Boolean: {
		//        Number: "Number"
		//    }
		//    Number:  {
		//        Boolean: "Number"
		//    }
		//  }
		implicit: {
			PLUS: {
				"Boolean": {
					"Boolean": "Number",
					"Number": "Number"
				},
				"Number": {
					"Boolean": "Number",
					"Number": "Number"
				},
				"String": {
					"String": "String"
				}
			},
			MINUS: {
				"Boolean": {
					"Boolean": "Number",
					"Number": "Number"
				},
				"Number": {
					"Boolean": "Number",
					"Number": "Number"
				}
			},
			MUL: {
				"Boolean": {
					"Boolean": "Number",
					"Number": "Number"
				},
				"Number": {
					"Boolean": "Number",
					"Number": "Number"
				}
			},
			DIV: {
				"Boolean": {
					"Boolean": "Number",
					"Number": "Number"
				},
				"Number": {
					"Boolean": "Number",
					"Number": "Number"
				}
			},
			MOD: {
				"Boolean": {
					"Boolean": "Number",
					"Number": "Number"
				},
				"Number": {
					"Boolean": "Number",
					"Number": "Number"
				}
			},
			BIT: { // binary bitwise operators
				"Boolean": {
					"Boolean": "Number",
					"Number": "Number"
				},
				"Number": {
					"Boolean": "Number",
					"Number": "Number"
				}
			},
			ASSIGN: { //"special" assignments, e.g. +=, -=
				"Number": {
					"Boolean": "Number",
					"Number": "Number"
				}
			}
		}
	};
	
	var lastReturnType = ""; //the return type of the last function we checked
	
	//Internal function for identifier resolution
	function _resolve(id, Node, Compiler, callback, isDeclaration) {
		Compiler.LookupScopeChain(id, Compiler.scopeChain.length-2, function(find) {
			if (!find && !isDeclaration) {
				Compiler.NewError({
					type: ReferenceError,
					message: "Variable " + id + " has not been declared"
				}, Node);
			}
			
			if (find.isBlockVariable) {
				var i = 0,
					bVars = Compiler.scopes[find.scopeId].BlockVariables,
					len = bVars.length;
					
				for (; i < len; i++) {
					if (bVars[i].identifier === find.data) {
						typeof callback == "function" && callback(bVars[i]);
						
						return;
					}
				}
			}
			else {
				typeof callback == "function" && callback(find.data, find);
				
				return;
			}
		});
	}
	
	//Internal function to look up prototype chain for an arbitrary property
	function lookupProto(node, property) {
		var hasOwn = Object.prototype.hasOwnProperty;
		while(node) {
			if (node.properties && hasOwn.call(node.properties, property)) {
				return node.properties[property];
			}
			
			if (node["[[Prototype]]"]) node = node["[[Prototype]]"];
		}
	}
	
	//Reduces chained dot and index property accessors to a single value
	function _reduceProps(node, Compiler) {
		var out = [];
		
		switch (node[0].type) {
			//Most common first
			case jsdef.IDENTIFIER:
			case jsdef.TRUE: case jsdef.FALSE: case jsdef.NULL:
				out.push(node[0].value);
				break;
			case jsdef.GROUP:
			case jsdef.DOT:
			case jsdef.INDEX:
				out = out.concat(_reduceProps(node[0], Compiler));
				break;
				
			case jsdef.ARRAY_INIT:
				out.push("Array");
				out.push("prototype");
				break;
			case jsdef.OBJECT_INIT:
				out.push("Object");
				out.push("prototype");
				break;
			case jsdef.BOOLEAN:
				out.push("Boolean");
				out.push("prototype");
				break;
			case jsdef.FUNCTION:
				out.push("Function");
				out.push("prototype");
				break;
			case jsdef.NUMBER:
				out.push("Number");
				out.push("prototype");
				break;
			case jsdef.REGEXP:
				out.push("RegExp");
				out.push("prototype");
				break;
			case jsdef.STRING:
				out.push("String");
				out.push("prototype");
				break;
				
			//Otherwise, throw an error
			default:
				Compiler.NewError({
					type: SyntaxError,
					message: "Illegal operation on dot accessor with #typesys strict"
				}, Node);
				break;
		}
					
		if (node.type == jsdef.DOT) {
			out.push(node[1].value);
		}
		else if (node.type == jsdef.INDEX) {
			switch (node[1].type) {
				//Don't allow dynamic property assignments without dicts
				case jsdef.IDENTIFIER:
					//use [false, identifier] to identify dynamic properties
					//all other properties are strings
					out.push([false, node[1].value]);
					break;
					
				case jsdef.TRUE: case jsdef.FALSE: case jsdef.NULL:
				case jsdef.STRING:
				case jsdef.NUMBER:
					out.push(node[1].value);
					break;
					
				case jsdef.VOID:
					out.push("undefined");
					break;
					
				//Otherwise, throw an error
				default:
					Compiler.NewError({
						type: SyntaxError,
						message: "Illegal index operation with #typesys strict"
					}, Node);
					break;
			}
		}
		
		return out;
	}

	this.typesys = function(Node, Compiler) {
		var _this = this;
		
		//Partial application of _resolve function
		function resolve(id, callback, isDeclaration) {
			_resolve(id, Node, Compiler, callback, isDeclaration);
		}
		//Partial application of _reduceProps function
		function reduceProps(node){ return _reduceProps(node, Compiler) }
		//Partial application of _reduceIndex function
		function reduceIndex(node){ return _reduceIndex(node, Compiler) }
		
		switch(Node.type) {
			case jsdef.FUNCTION:
				if (!Node.returntype) {
					Compiler.NewError({
						type: TypeError,
						message: "Missing type declaration for function " + Node.name
					}, Node);
					
					break;
				}
				else {
					lastReturnType = Node.returntype;
					return "Function";
				}
			case jsdef.VAR:
				for (var item in Node) {
					if (!isFinite(item)) continue;
					
					if (typeof Node[item].vartype == "undefined") {
						Compiler.NewError({
							type: TypeError,
							message: "Missing type declaration for var " + Node[item].value
						}, Node);
					}
					else if (Node[item].vartype == "Array") {
						Compiler.NewError({
							type: TypeError,
							message: "Cannot declare generic untyped Array with #typesys strict for var " + Node[item].value
						}, Node);
					}
					else {
						//Test for if (...) { var a as Number; } else { var a as String; }
						if (Compiler.conditionals.length) {
							resolve(Node[item].value, function(data) {
								if (data) {
									//Don't allow re-declaration as different type
									if (data["[[Type]]"] !== Node[item].vartype) {
										Compiler.NewError({
											type: TypeError,
											message: "Cannot re-declare var " + Node[item].value + 
														" as different type inside conditional"
										}, Node);
									}
								}
							}, true);
						}
						//If we're not inside a conditional, check for a re-declaration
						//and update the [[Type]].  We only need to do this for VAR, 
						//but not LET as it's block scoped
						else {
							var Variables;
							resolve(Node[item].value, function(data, fullData) {
								if (!fullData) return;
							
								Variables = Compiler.scopes[fullData.scopeId].Variables;
							}, true);
						
							if (Variables) for (var i=0, len=Variables.length; i<len; i++) {
								if (Variables[i].identifier == Node[item].value) {
									Variables[i]["[[Type]]"] = Node[item].vartype;
									break;
								}
							}
						}
						
						if (Node[item].initializer) {
							//If we're inside an object, tag it
							if (Node[item].initializer.type == jsdef.OBJECT_INIT) {
								Node[item].initializer.assignedTo = Node[item].value;
							}
							
							//Is this is a function expression?
							if (Node[item].initializer.type == jsdef.FUNCTION) {
								Node[item].value.returntype = Node[item].initializer.returntype;
							}
							
							var newType = _this.typesys(Node[item].initializer, Compiler);
							
							if (newType !== Node[item].vartype) {
								Compiler.NewError({
									type: TypeError,
									message: "Cannot convert " + newType + " to " + Node[item].vartype
								}, Node);
							}
						}
					}
				}
				break;
			case jsdef.LET:
				for (var item in Node) {
					if (!isFinite(item)) continue;
					
					if (typeof Node[item].vartype == "undefined") {
						Compiler.NewError({
							type: TypeError,
							message: "Missing type declaration for let " + Node[item].value
						}, Node);
					}
					else {
					}
				}
				break;
			case jsdef.PROPERTY_INIT:
				var nodeParent, parents = [];
				
				if (Node.parentObject && Node.parentObject.assignedTo) {
					nodeParent = Node.parentObject.assignedTo;
				}
				else if (Node.parentProperty) {
					var walk = Node.parentProperty;
					
					while (walk) {
						if (walk.parentProperty) {
							parents.push(walk.parentProperty.name);
							walk = walk.parentProperty;
						}
						else {
							walk = walk.parentObject;
							break;
						}
					}
					
					nodeParent = walk.assignedTo;
				}
				
				if (parents.length || (Node.parentProperty && Node.parentProperty.name)) {
					parents.unshift(Node.parentProperty.name);
					parents.unshift(Node[0].value);
					parents = parents.reverse();
				}
				
				//For object properties, we do type inference to keep the syntax terse
				resolve(nodeParent, function(data, fullData) {
					var getProps = data.value;
					for (var item in getProps) {
						if (!isFinite(item)) continue;
						
						if (!Node.parentProperty) {
							if (getProps[item][0].value == Node[0].value) {
								getProps[item][1]["[[Type]]"] =
									_this.typesys(getProps[item][1], Compiler);
							}
						}
						//Recursive descent to find nested object propreties
						else if (parents.length && getProps[item][0].value == parents[0]) {
							parents.shift();
							var Property = (function descend(getProps) {
								for (var item in getProps) {
									if (!isFinite(item)) continue;
									if (getProps[item][0].value == parents[0]) {
										parents.shift();
										
										if (parents.length) {
											return descend(getProps[item][1]);
										}
										else {
											return getProps[item];
										}
									}
								}
							})(getProps[item][1]);
							
							Property[1]["[[Type]]"] = _this.typesys(Property[1], Compiler);
						}
					}
				});
				break;
			case jsdef.ASSIGN:
				var type1, type2, Variables, Property;
				if (Node[0].type == jsdef.IDENTIFIER) {
					//Don't allow re-declaration of global constructors and properties
					if (~["undefined",
						 "Infinity",
						 "NaN",
						 "Array",
						 "Boolean",
						 "Date",
						 "Function",
						 "Number",
						 "Object",
						 "RegExp",
						 "String"].indexOf(Node[0].value)) {
						Compiler.NewError({
							type: ReferenceError,
							message: "Cannot re-declare " + Node[0].value
						}, Node);
					}
					
					type2 = _this.typesys(Node[1], Compiler);
					resolve(Node[0].value, function(data, fullData) {
						type1 = data["[[Type]]"];
						
						if (!fullData) return; //Put this after assignment to type1 for block vars
						Variables = Compiler.scopes[fullData.scopeId].Variables;
					});
				}
				else if (Node[0].type == jsdef.DOT || Node[0].type == jsdef.INDEX) {
					var p, resolvedIndex = false, index = "";
					
					//Normalize the property accessor
					if (Node[0].type == jsdef.INDEX) {
						var checkType = this.typesys(Node[0][1], Compiler);
						if (checkType == "String" || checkType == "Number") {
							if (Node[1].type == jsdef.STRING || Node[1].type == jsdef.NUMBER) {
								resolvedIndex = true;
								p = Node[0][0].value;
								index = Node[0][1].value;
							}
							//TODO: concat strings and add numbers
							else if (Node[1].type == jsdef.PLUS) {
							}
						}
						
						if (!resolvedIndex) {
							Compiler.NewWarning({
								type: ReferenceError,
								message: "Cannot resolve index: " + Node[0][0].value +
											"[" + Node[0][1].value + "]"
							}, Node);
							
							break; //Can't resolve index, so skip it
						}
					}
					else {
						p = Node[0][0].value;
					}
					
					//Deal with nested properties
					if (Node[0][0].type == jsdef.DOT) {
						var chain = [Node[0].value], cNode = Node[0][0];
						
						while (cNode.type == jsdef.DOT) {
							chain.push(cNode.value);
							cNode = cNode[0];
						}
						
						if (cNode.type == jsdef.IDENTIFIER) p = cNode.value;
						chain = chain.reverse();
						
						var prop = chain[chain.length-1];
						
						resolve(p, function(data) {
							var getProps = data.value;
							for (var item in getProps) {
								if (!isFinite(item)) continue;
					
								if (getProps[item][0].value == chain[0]) {
									chain.shift();
									var Property = (function descend(getProps) {
										var r, o, c;
										if (chain.length == 1) {
											o = getProps;
											for (var _item in o) {
												if (!isFinite(_item)) continue;
												
												if (o[_item][0].value == prop) {
													return o[_item];
												}
											}
										}
										for (var item in getProps) {
											if (!isFinite(item)) continue;
											
											if (getProps[item][0].value == chain[0]) {
												c = chain.shift();
									
												if (chain.length) {
													r = descend(getProps[item][1]);
													
													if (r) {
														return r;
													}
													else {
														o = getProps[item][1];
														for (var _item in o) {
															if (!isFinite(_item)) continue;
															
															if (o[_item][0].value == prop) {
																return o[_item];
															}
														}
													}
												}
											}
										}
									})(getProps[item][1]);
									
									if (Property[0].value == prop) {
										type1 = Property[1]["[[Type]]"];
										type2 = _this.typesys(Node[1], Compiler);
									}
						
									break;
								}
							}
						});
					}
					//If it's not a nested property, just look up the types
					else {
						resolve(p, function(data) {
							if (!data) return false;
						
							var getProps = data.value, found = false;
							for (var item in getProps) {
								if (!isFinite(item)) continue;
						
								if (getProps[item][0].value ==
									(resolvedIndex ? index : Node[0].value)) {
									found = true;
								
									Property = getProps[item][1];
								
									type1 = Property["[[Type]]"];
									type2 = _this.typesys(Node[1], Compiler);
								}
							}
						
							//This disallows an object property declaration outside
							//an object literal initializer
							//Example:
							//  var a = {foo: "foo", bar: 1}; //OK
							//  a.baz = "baz"; //SyntaxError
							//TODO: Make this act as a declaration instead
							//		Otherwise, we can't declare types for this[...]
							if (!found) {
								Compiler.NewError({
									type: SyntaxError,
									message: "Property has not been declared"
								}, Node);
							}
						});
					}
				}
				
				if (~["+", "-", "*", "/", "%", "<<", ">>", ">>>", "&", "^", "|", "**"].indexOf(Node.value)) {
					if (this.typerules.implicit.ASSIGN[type1] &&
						this.typerules.implicit.ASSIGN[type1].hasOwnProperty(type2)) {
						//Re-cast the type if the operation is permitted
						if (Variables) {
							for (var i=0, len=Variables.length; i<len; i++) {
								if (Variables[i].identifier == Node[0].value) {
									Variables[i]["[[Type]]"] = 
										this.typerules.implicit.ASSIGN[type1][type2];
									break;
								}
							}
						}
						else if (Property) {
							Property["[[Type]]"] = 
								this.typerules.implicit.ASSIGN[type1][type2];
						}
					}
					else {
						Compiler.NewError({
							type: TypeError,
							message: "Illegal operation " + Node.value + "= on: " + type1 + " and " + type2
						}, Node);
					}
				}
				else {
					if (type1 !== type2) {
						Compiler.NewError({
							type: TypeError,
							message: "Cannot convert " + type2 + " to " + type1
						}, Node);
					}
				}
				break;
				
			case jsdef.IDENTIFIER:
				var type;
				resolve(Node.value, function(data) {
					if (data.type == jsdef.FUNCTION) type = "Function";
					else type = data["[[Type]]"];
				});
				return type;
			case jsdef.RETURN:
				var fun = Compiler.CurrentFunction(Compiler.scopeChain.length-1),
					type1 = fun.returntype,
					type2 = this.typesys(Node.value, Compiler);

				if (type1 !== type2) {
					Compiler.NewError({
						type: TypeError,
						message: "Cannot convert " + type2 + " to " + type1
					}, Node);
				}
				break;
				
			//Primitive Types
			case jsdef.ARRAY_INIT:
				var type1, type2;
				
				//Do some type inference so we don't have to explicitly convert
				//array
				//Example:
				//  var a as String[] = StringArray(["foo", "bar"]); //OK, but verbose
				//  var a as String[] = ["foo", "bar"];
				//Type inference uses first element to determine array type
				for (var item in Node) {
					if (!isFinite(item)) continue;
					
					//Determine type of first element
					if (item === "0" || item === 0) {
						type1 = this.typesys(Node[0], Compiler);
						
						if (type1 == "Array") {
							Compiler.NewError({
								type: TypeError,
								message: "Cannot declare generic untyped Array with #typesys strict"
							}, Node);
						}
						
						continue;
					}
					//Check that subsequent types match type of first element
					else if (type1) {
						type2 = this.typesys(Node[item], Compiler);
						
						if (type1 !== type2) {
							Compiler.NewError({
								type: TypeError,
								message: "Cannot convert " + type2 + " to " + type1
							}, Node);
						}
					}
				}
				
				if (/\[]$/.test(type1)) return "Array[]";
				
				if (type1) return type1 + "[]";
				else return "Array";
				
			case jsdef.TRUE:
			case jsdef.FALSE:
				return "Boolean";
			//case jsdef.FUNCTION: //Scroll up for "FUNCTION"
			//	return "Function";
			case jsdef.NULL:
				return "null";
			case jsdef.NUMBER:
				return "Number";
			case jsdef.OBJECT_INIT:
				return "Object";
			case jsdef.REGEXP:
				return "RegExp";
			case jsdef.STRING:
				return "String";
				
			//Binary Arithmetic Operators
			case jsdef.PLUS:
			case jsdef.MINUS:
			case jsdef.MUL:
			case jsdef.DIV:
			case jsdef.MOD:
				var operation = "", op = "";
				
				if (Node.type == jsdef.PLUS) op = "PLUS";
				else if (Node.type == jsdef.MINUS) op = "MINUS";
				else if (Node.type == jsdef.MUL) op = "MUL";
				else if (Node.type == jsdef.DIV) op = "DIV";
				else if (Node.type == jsdef.MOD) op = "MOD";
				
				operation = this.typerules.implicit[op];
				
				var type1 = _this.typesys(Node[0], Compiler);
				var type2 = _this.typesys(Node[1], Compiler);
				
				if (operation[type1]) {
					if (operation[type1].hasOwnProperty(type2)) {
						return operation[type1][type2];
					}
					else {
						Compiler.NewError({
							type: TypeError,
							message: "Cannot convert " + type1 + " to " + type2
						}, Node);
					}
				}
				else {
					Compiler.NewError({
						type: TypeError,
						message: "Illegal operation " + op + " on: " + type1 + " and " + type2
					}, Node);
				}
				
				break;
				
			//Binary Bitwise Operators
			case jsdef.BITWISE_AND:
			case jsdef.BITWISE_OR:
			case jsdef.BITWISE_XOR:
			case jsdef.LSH:
			case jsdef.RSH:
			case jsdef.URSH:
				var operation = "", op = "";
				
				if (Node.type == jsdef.BITWISE_AND) op = "&";
				else if (Node.type == jsdef.BITWISE_OR) op = "|";
				else if (Node.type == jsdef.BITWISE_XOR) op = "^";
				else if (Node.type == jsdef.LSH) op = "<<";
				else if (Node.type == jsdef.RSH) op = ">>";
				else if (Node.type == jsdef.URSH) op = ">>>";
				
				operation = this.typerules.implicit.BIT;
				
				var type1 = _this.typesys(Node[0], Compiler);
				var type2 = _this.typesys(Node[1], Compiler);
				
				if (operation[type1]) {
					if (operation[type1].hasOwnProperty(type2)) {
						return operation[type1][type2];
					}
					else {
						Compiler.NewError({
							type: TypeError,
							message: "Cannot convert " + type1 + " to " + type2
						}, Node);
					}
				}
				else {
					Compiler.NewError({
						type: TypeError,
						message: "Illegal operation " + op + " on: " + type1 + " and " + type2
					}, Node);
				}
				
				break;
				
			//Logical operators, and bitwise NOT (~)
			case jsdef.NOT:
				return "Boolean";
			case jsdef.BITWISE_NOT:
				return "Number";
			case jsdef.AND:
			case jsdef.OR:
				var type1 = _this.typesys(Node[0], Compiler);
				var type2 = _this.typesys(Node[1], Compiler);
				
				if (type1 === type2) {
					return type1;
				}
				else {
					Compiler.NewError({
						type: TypeError,
						message: "Cannot convert " + type1 + " to " + type2
					}, Node);
				}
				
			//Other operators (++, --, unary operators)
			case jsdef.INCREMENT:
			case jsdef.DECREMENT:
			case jsdef.UNARY_PLUS:
			case jsdef.UNARY_MINUS:
				var getType = _this.typesys(Node[0], Compiler);
				
				if (~this.typerules.explicit.__UNARY__.indexOf(getType)) {
					//These operations always return a "Number"
					return "Number";
				}
				else {
					var op = "";
					if (Node.type == jsdef.INCREMENT) {
						Compiler.NewError({
							type: TypeError,
							message: "Illegal operation INCREMENT on: " + getType
						}, Node);
					}
					else if (Node.type == jsdef.DECREMENT) {
						Compiler.NewError({
							type: TypeError,
							message: "Illegal operation DECREMENT on: " + getType
						}, Node);
					}
					else {
						Compiler.NewError({
							type: TypeError,
							message: "Cannot convert " + getType + " to Number"
						}, Node);
					}
				}
				
				break;
				
			//Comparison operators
			case jsdef.EQ:
			case jsdef.NE:
			case jsdef.STRICT_EQ:
			case jsdef.STRICT_NE:
			case jsdef.GT:
			case jsdef.GE:
			case jsdef.LT:
			case jsdef.LE:
				return "Boolean";
				
			//Functions and type casting
			case jsdef.CALL:
				var TypedArrays = ["BooleanArray", "DateArray", "FunctionArray",
								   "NumberArray", "ObjectArray", "RegExpArray",
								   "StringArray"];
				//Yes, we can loop the above var, but this small work for a faster compiler
				var _TypedArrays = ["Boolean[]", "Date[]", "Function[]",
								   "Number[]", "Object[]", "RegExp[]",
								   "String[]"];
				
				if (Node[0].type == jsdef.IDENTIFIER) {
					if (~["Array", "Boolean", "Date", "Function",
					      "Number", "Object", "RegExp", "String"].indexOf(Node[0].value)) {
						return Node[0].value;
					}
					//Translate StringArray to String[], NumberArray to Number[], etc
					else if (~TypedArrays.indexOf(Node[0].value)) {
						return Node[0].value.replace(/Array$/, "[]");
					}
					//Make sure ArrayArray() does not take any untyped arrays
					else if (Node[0].value == "ArrayArray" && Node[1].type == jsdef.LIST) {
						var getType;
						for (var item in Node[1]) {
							if (!isFinite(item)) continue;
							
							getType = this.typesys(Node[1][item], Compiler);
							
							!~_TypedArrays.indexOf(getType) &&
								Compiler.NewError({
									type: TypeError,
									message: "Cannot convert " + getType + " to typed array"
								}, Node);
						}
						
						return "Array[]";
					}
					//For everything else, we look up the function
					else {
						var returntype;
						resolve(Node[0].value, function(data, fullData) {
							//Function declarations
							if (data.type == jsdef.FUNCTION) {
								returntype = data.returntype;
							}
							//Function expressions
							else if (!fullData.isFunctionDecl && data.value && 
									 data.value.functionForm === 1) {
								returntype = data.value.returntype;
							}
						});
						
						return returntype;
					}
				}
				else if (Node[0].type == jsdef.FUNCTION) {
					return Node[0].returntype;
				}
				else if (Node[0].type == jsdef.GROUP) {
					var getType = _this.typesys(Node[0], Compiler);
					
					if (getType == "Function") {
						return lastReturnType;
					}
					else {
						Compiler.NewError({
							type: TypeError,
							message: "Cannot call " + getType
						}, Node);
					}
				}
				//Dot accessor
				else if (Node[0].type == jsdef.DOT) {
					var reduced = reduceProps(Node), _type;
				
					if (!reduced || (reduced && !reduced.length)) break;
				
					resolve(reduced[0], function(data) {
						var hasOwn = Object.prototype.hasOwnProperty,
							_data = data, prop;
					
						for (var i=1, len=reduced.length; i<len; i++) {
							//First look up properties of object
							if (_data.properties) {
								if (hasOwn.call(_data.properties, reduced[i])) {
									if (i == reduced.length - 1) {
										prop = _data.properties[reduced[i]];
										
										_type = prop.type == jsdef.FUNCTION ?
											prop.returntype : prop["[[Type]]"];
									}
									else {
										_data = _data.properties[reduced[i]];
										continue;
									}
								}
							}
						
							//After we've looked up direct properties, look up
							//prototype chain
							if (_data["[[Prototype]]"]) {
								_data = _data["[[Prototype]]"];
								i--;
								continue;
							}
						}
					});
					
					return _type;
				}
				break;
				
			//Properties
			case jsdef.DOT:
			case jsdef.INDEX:
				var reduced = reduceProps(Node), _type;
				
				if (!reduced || (reduced && !reduced.length)) break;
				
				resolve(reduced[0], function(data) {
					var hasOwn = Object.prototype.hasOwnProperty,
						_data = data;
					
					//TODO: handle dynamic properties
					for (var i=1, len=reduced.length; i<len; i++) {
						//First look up properties of object
						if (_data.properties) {
							if (hasOwn.call(_data.properties, reduced[i])) {
								if (i == reduced.length - 1) {
									_type = _data.properties[reduced[i]]["[[Type]]"];
								}
								else {
									_data = _data.properties[reduced[i]];
									continue;
								}
							}
						}
						
						//After we've looked up direct properties, look up
						//prototype chain
						if (_data["[[Prototype]]"]) {
							_data = _data["[[Prototype]]"];
							i--;
							continue;
						}
					}
				});
				
				return _type;
				
			//Miscellaneous expression tokens
			case jsdef.GROUP:
				return _this.typesys(Node[0], Compiler);
			case jsdef.COMMA:
				return _this.typesys(Node[+Node.length - 1], Compiler);
			case jsdef.NEW:
				//TODO: new Class() should return the class
				return "Object";
			case jsdef.NEW_WITH_ARGS:
				break;
			case jsdef.HOOK:
				var type1 = _this.typesys(Node[1], Compiler),
					type2 = _this.typesys(Node[2], Compiler);
					
				if (type1 === type2) {
					return type1;
				}
				else {
					Compiler.NewError({
						type: TypeError,
						message: "Type mismatch: " + type1 + " and " + type2
					}, Node);
				}
			case jsdef.TYPEOF:
				return "String";
			case jsdef.DELETE:
			case jsdef.IN:
			case jsdef.INSIDE:
			case jsdef.INSTANCEOF:
				return "Boolean";
			case jsdef.VOID:
				return "undefined";
				
			default:
				break;
		}
	};
};
