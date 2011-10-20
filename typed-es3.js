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
		
		toString: CreateFunction("String"),
		toLocaleString: CreateFunction("String"),
		valueOf: CreateFunction("*"),
		hasOwnProperty: CreateFunction("Boolean", "String"),
		isPrototypeOf: CreateFunction("Boolean", "Object"),
		propertyIsEnumerable: CreateFunction("Boolean", "String")
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
			
			toString: fn_toString,
			apply: fn_apply,
			call: fn_call,
			
			length: {
				value: arguments.length >>> 0,
				
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true,
				
				"[[Type]]": "Number"
			}
		};
		
		fun.constructor = {
			"[[Type]]": "Function",
			
			type: jsdef.FUNCTION,
			returntype: "Function",
			
			prototype: {
				"[[Class]]": "Function",
				"[[Type]]": "Function",
				"[[Prototype]]": objPro,
				
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true,
			
				toString: fn_toString,
				apply: fn_apply,
				call: fn_call,
				
				type: jsdef.FUNCTION,
				returntype: "undefined"
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
			
			"[[Prototype]]": _Object,
			
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
	var fn_proto = CreateFunction("undefined"),
		fn_toString = CreateFunction("String"),
		fn_apply = CreateFunction("*", "Object", "Array"),
		fn_call = CreateFunction("*", "Object", "...*");
	fn_apply.apply = fn_call.apply = fn_proto.apply = fn_apply;
	fn_apply.call = fn_call.call = fn_proto.call = fn_call;
	
	var _Object = extend(CreateFunction("Object", "*"), {
		identifier: "Object",
		value: {},
	
		"[[Class]]": "Object",
		"[[DontDelete]]": false
	});
	_Object.prototype = {
		"[[Prototype]]": null,
		
		constructor: _Object,
		toString: fn_toString,
		toLocaleString: CreateFunction("String"),
		valueOf: CreateFunction("*"), //TODO: wrong?
		hasOwnProperty: CreateFunction("Boolean", "String"),
		isPrototypeOf: CreateFunction("Boolean", "Object"),
		propertyIsEnumerable: CreateFunction("Boolean", "String")
	};
	obj.constructor = _Object; //Object prototype object's constructor is Object constructor
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
	var _Function = extend(CreateFunction("Function", "*"), {
		identifier: "Function",
		value: {},
	
		"[[Class]]": "Function",
		"[[DontDelete]]": false
	});
}
