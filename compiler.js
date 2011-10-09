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
					message: 'Compiler global header file "es3.js" not found.'
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
	
	this.currentLabel = ""; //Labels for loops
	this.breakStmt = ""; //Track break statements
	this.continueStmt = ""; //Track continue statements
	this.inCase = false; //Are we inside a case/default statement?
	
	//Classes
	this.currentClass = "";
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
				}
				else {
					classItems.push(currentItem);
					
					if (currentItem.private && currentItem.type == jsdef.VAR) {							
						for (var varNode in currentItem) {
							if (!isFinite(varNode)) continue;
							
							privateMembers.push(currentItem[varNode].value);
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
			out.push("var __SUPER__;");
			
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
			var classId = "__CLASS" + ast.body.scopeId + "__";
			out.push("var " + classId + "=this,");
			//Don't use "Object" to avoid identifier lookup
			out.push("__PDEFINE__={}.constructor.defineProperty,");
			out.push("__NOENUM__={enumerable:false};");
			out.push("if(typeof __PDEFINE__!='function')__PDEFINE__=null;");

			out.push("this.__SUPER__=__SUPER__;");
			out.push("__PDEFINE__&&__PDEFINE__(this,'__SUPER__',__NOENUM__);");
			out.push("this.__PROTECTED__={};");
			out.push("__PDEFINE__&&__PDEFINE__(this,'__PROTECTED__',__NOENUM__);");
			
			//Class body
			var currentClassItem, currentVar, staticItems = [];
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
			
			//Push methods - we do this separately in case of overloading
			var _out;
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
			
			//Run static constructor last
			if (staticConstructor) {
				out.push("(function(){");
				out.push(generate(staticConstructor.body));
				out.push("}).call(this);");
			}
			
			out.push("return this");
			
			out.push("}).call(");
			
			if (ast.extends) {
				out.push("(function(o){return (F.prototype=__SUPER__=o,new F);function F(){}})(");
				out.push("new " + ast.extends + ")");
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
					out.push("var " + ast.name + "=function(");
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
				
				out.push("var " + ast.name + "=function(");
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
			if (ast.public || ast.private || ast.static || ast.protected) out.push(";");
			
			//Are we inside a class?
			if (this.InsideClass()) {
				this.CurrentClass().Variables.push({
					identifier: ast.name,
					
					//Standard internal properties
					"[[ReadOnly]]": false,
					"[[DontEnum]]": false,
					"[[DontDelete]]": !!ast.private,
					
					//Non-standard internal properties
					"[[Public]]": !!ast.public,
					"[[Private]]": !!ast.private,
					"[[Static]]": !!ast.static,
					"[[Protected]]": !!ast.protected,
					"[[ClassMember]]": true,
					"[[MemberOf]]": this.currentClass,
					"[[ClassId]]": this.CurrentClassScopeId()
				});
				
				ast.public && this.classes[this.CurrentClassScopeId()].publicMembers.push(id);
				ast.protected && this.classes[this.CurrentClassScopeId()].protectedMembers.push(id);
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
				out.push(this.currentLabel + "for(" + setupFor);
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
					
					//Internal properties
					"[[ReadOnly]]": false,
					"[[DontEnum]]": false,
					"[[DontDelete]]": true,
					
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
					this.CurrentClass().Variables.push(varObject = {
						identifier: id,
					
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
					
					if (ast.public) this.classes[this.CurrentClassScopeId()].publicMembers.push(id);
					else if (ast.protected) this.classes[this.CurrentClassScopeId()].protectedMembers.push(id);
					
					//context.ActivationObject[id] = varObject;
				}
				//else {
					scope.Variables.push(context.ActivationObject[id] = varObject);
				//}
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
				else out.push("=undefined");
				
				out.push(";");
				
				//Has this variable already been declared in the execution context?
				for (var j=scope.Variables.length-1; j>=0; j--) {
					if (scope.Variables[j].identifier !== varList[i]._previousIdentifier) {
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
										out.push(findIdentifier);
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
			out.push("this");
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
								type: SyntaxError,
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
								type: SyntaxError,
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
								type: SyntaxError,
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
								type: SyntaxError,
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
							type: SyntaxError,
							message: "Invalid range"
						}, ast);
					}
				}
				else {
					this.NewError({
						type: SyntaxError,
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
				type: SyntaxError,
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
			
			out.push("{");
			for (var item in ast) {
				if (!isFinite(item)) continue;
				
				if (ast.parentProperty) ast[item].parentProperty = ast.parentProperty;
				else ast[item].parentObject = ast;
				
				out.push(generate(ast[item]));
				
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
