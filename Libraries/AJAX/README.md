# AJAX for JS++

This is a basic AJAX library for JS++. It supports HTTP GET and POST.

Tired of including the entire jQuery library just to make one AJAX call? With JS++ you don't have to. With [dead code elimination](https://en.wikipedia.org/wiki/Dead_code_elimination), if you only send a GET request, the JS++ compiler will *not* compile all of the library's functions for dealing with POST requests.

## Getting Started

In your editor, create a `main.jspp` file:

	import Vendor.Onux.Utils.DOM.AJAX;
	external console;

	AJAX.get("/path/to/some/resource/", void(string result) {
	    console.log("Success: " + result);
	});

Make sure you link the AJAX library when you compile. In your terminal:

    $ js++ main.jspp path/to/ajax-lib/

## License

MIT License