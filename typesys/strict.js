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

	this.typesys = function(Node, Compiler) {
		var _this = this;
		
		//Partial application of _resolve function
		function resolve(id, callback, isDeclaration) {
			_resolve(id, Node, Compiler, callback, isDeclaration);
		}
		
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
				resolve(nodeParent, function(data) {
					var getProps = data.value;
					for (var item in getProps) {
						if (!isFinite(item)) continue;
						
						if (!Node.parentProperty) {
							if (getProps[item][0].value == Node[0].value) {
								getProps[item][1]["[[Type]]"] =
									_this.typesys(getProps[item][1], Compiler);
								break;
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
							break;
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
				//TODO: toString, toLowerCase, toUpperCase
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
				break;
				
			//Miscellaneous expression tokens
			case jsdef.GROUP:
				break;
			case jsdef.COMMA:
				break;
			case jsdef.NEW:
				break;
			case jsdef.HOOK:
				break;
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
