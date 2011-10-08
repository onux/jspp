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
