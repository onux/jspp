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
	node.Variables.push(extend(CreateFunction("Function", "*"), {
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
	node.Variables.push(extend(_Error, {
		identifier: "EvalError"
	}));
	node.Variables.push(extend(_Error, {
		identifier: "RangeError"
	}));
	node.Variables.push(extend(_Error, {
		identifier: "ReferenceError"
	}));
	node.Variables.push(extend(_Error, {
		identifier: "SyntaxError"
	}));
	node.Variables.push(extend(_Error, {
		identifier: "TypeError"
	}));
	node.Variables.push(extend(_Error, {
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
}
