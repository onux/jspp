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
            LT: 10, LE: 10, GE: 10, GT: 10, IN: 10, INSIDE: 10, INSTANCEOF: 10,
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
            LT: 2, LE: 2, GE: 2, GT: 2, IN: 2, INSIDE: 2, INSTANCEOF: 2,
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
                case jsdef.INSTANCEOF:
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
