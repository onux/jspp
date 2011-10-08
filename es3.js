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
//Please do not send push requests just for the sake of conforming to the specification

function CreateGlobal(node) {
	return; //Don't need this for alpha stage
	
	function CreateObject() {
		return {
			"[[Class]]": "Object",
			
		};
	}
	function CreateFunction(args) {
		var fun = {
			"[[Class]]": "Function",
			"[[Prototype]]": Function.prototype,
			
			length: {
				value: args >>> 0,
				
				"[[DontEnum]]": true,
				"[[DontDelete]]": true,
				"[[ReadOnly]]": true
			}
		};
		
		return fun;
	}
	
	var internal = {
		"Object": {
		},
		"Function": {
			prototype: {
				"[[Class]]": "Function",
				"[[Prototype]]": internal.Object.prototype,
			
				constructor: internal.Function,
				toString: {
				}
			}
		}
	};

	//ES3 15.1.1: Value Properties of the Global Object
	node.Variables.push({
		identifier: "NaN",
		value: "a" / 2,
	
		"[[DontEnum]]": true,
		"[[DontDelete]]": true
	});
	node.Variables.push({
		identifier: "Infinity",
		value: 1/0,
	
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
	node.Variables.push({
		identifier: "parseInt",
		value: parseInt,
		arity: 1,
	
		"[[DontEnum]]": true
	});
	node.Variables.push({
		identifier: "eval",
		value: eval,
		arity: 1,
	
		"[[DontEnum]]": true
	});

	node.Variables.push({
		identifier: "String",
		value: undefined,
	
		"[[Prototype]]": internal.Function._prototype,
		"[[Class]]": "String",
		"[[ReadOnly]]": false,
		"[[DontEnum]]": false,
		"[[DontDelete]]": false
	});
}
