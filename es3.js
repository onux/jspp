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

//This does not conform *exactly* with ES3 - only where practical
//e.g. we do not *practically* need a [[Call]] property
//Please do not send pull requests just for the sake of conforming to the specification

function CreateGlobal(node) {

	var internal = {
		"Object": {
			prototype: {
				"[[Class]]": "Object",
				"[[Prototype]]": null,
				
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true,
				
				//constructor: Object,
				toString: CreateFunction("String"),
				toLocaleString: CreateFunction("String"),
				valueOf: CreateFunction("*"), //TODO: wrong?
				hasOwnProperty: CreateFunction("Boolean", "String"),
				isPrototypeOf: CreateFunction("Boolean", "Object"),
				propertyIsEnumerable: CreateFunction("Boolean", "String")
			},
			
			//"[[Prototype]]": Function.prototype
		},
		"Function": {
			prototype: {
				"[[Class]]": "Function",
				//"[[Prototype]]": Object.prototype,
				
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true,
			
				//constructor: Function,
				toString: CreateFunction("String"),
				apply: CreateFunction("*", "Object", "Array"),
				call: CreateFunction("*", "Object", "...*")
			},
			
			"[[Prototype]]": this.prototype,
			
			//constructor: Function,
			length: {
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true
			}
		}
	};

	//Create extendable base ES3-compatible object
	//"Every built-in prototype object has the Object prototype object, which is
	// the initial value of the expression Object.prototype (15.2.3.1), as the 
	// value of its internal [[Prototype]] property, except the Object prototype
	// object itself."
	function CreateObject() {
		var obj = {
			"[[Class]]": "Object",
			"[[Prototype]]": Object.prototype,
			
			"[[DontEnum]]": true,
			
			prototype: {
				"[[Class]]": "Object",
				"[[Prototype]]": null,
				
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true,
				
				constructor: this.Object,
				toString: CreateFunction("String"),
				toLocaleString: CreateFunction("String"),
				valueOf: CreateFunction("*"),
				hasOwnProperty: CreateFunction("Boolean", "String"),
				isPrototypeOf: CreateFunction("Boolean", "Object"),
				propertyIsEnumerable: CreateFunction("Boolean", "String")
			},
			
			constructor: {
				"[[Prototype]]": this.Function.prototype
			}
		};
		
		return obj;
	}
	var objPro = CreateObject().prototype;
	
	//Create extendable base ES3-compatible function
	//"Every built-in function and every built-in constructor has the Function 
	// prototype object, which is the initial value of the expression 
	// Function.prototype (15.3.2.1), as the value of its internal [[Prototype]] 
	// property."
	function CreateFunction() {
		var returnType = arguments[0];
		arguments = Array.prototype.slice.call(arguments, 1);
		
		var fun = {
			"[[Class]]": "Function",
			"[[Type]]": "Function", //Non-standard
			"[[Prototype]]": Function.prototype,
			
			"[[DontEnum]]": true,
			
			type: jsdef.FUNCTION,
			returntype: returnType,
			
			length: {
				value: arguments.length >>> 0,
				
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true,
				
				"[[Type]]": "Number"
			}
		};
		
		fun.constructor = {
			prototype: {
				"[[Class]]": "Function",
				"[[Type]]": "Function",
				"[[Prototype]]": objPro,
				
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true,
			
				toString: fn_toString,
				apply: fn_apply,
				call: fn_call
			},
			
			length: {
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true,
				
				"[[Type]]": "Number"
			}
		};
		fun.prototype = {
			constructor: fun,
			
			"[[Type]]": "Object" //Non-standard
		};
		fun.constructor["[[Prototype]]"] = fun.constructor.prototype;
		fun.constructor.constructor = fun.constructor;
		
		for (var i=0, len=arguments.length; i<len; i++) {
			fun[i] = {
				"[[Type]]": arguments[i] //Non-standard
			};
		}
		
		return fun;
	}
	var fn_toString = CreateFunction("String"),
		fn_apply = CreateFunction("*", "Object", "Array"),
		fn_call = CreateFunction("*", "Object", "...*");
	
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

	//ES3 15.1.1: Value Properties of the Global Object
	node.Variables.push({
		identifier: "NaN",
		value: "a" / 2,
	
		"[[DontEnum]]": true,
		"[[DontDelete]]": true
	});
	node.Variables.push({
		identifier: "Infinity",
		value: 1 / 0,
	
		"[[DontEnum]]": true,
		"[[DontDelete]]": true
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
	var _Object = extend(CreateFunction("Object", "*"), {
		identifier: "Object",
		value: {},
	
		"[[Prototype]]": internal.Function.prototype,
		"[[Class]]": "Object",
		"[[DontDelete]]": false
	});
	node.Variables.push(_Object);

	node.Variables.push({
		identifier: "String",
		value: "",
	
		"[[Prototype]]": internal.Function.prototype,
		"[[Class]]": "String",
		"[[ReadOnly]]": false,
		"[[DontEnum]]": false,
		"[[DontDelete]]": false
	});
}
