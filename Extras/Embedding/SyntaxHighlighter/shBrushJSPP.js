;(function() {
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush() {
		var keywords =	[
			// JavaScript keywords
			"if", "in", "do", "for", "new", "try", "let", "this", "else", "case", "with", "while",
			"break", "catch", "throw", "const", "yield", "return", "typeof", "delete", "switch",
			"default", "finally", "continue", "debugger", "instanceof", "export", "extends",
			"implements", "package", "true", "false", "null",

			// JS++ Basic Keywords
			"import", "external", "module", "foreach", "typeid", "enum", "interface", "class",
			"super", "implicit", "explicit", "undefined",

			// JS++ Modifiers
			"private", "protected", "public", "static", "final", "inline", "property", "abstract",
			"optional", "virtual", "override",
			
			// JS++ Types
			"bool", "string", "byte", "char", "double", "float", "int",
			"long", "short", "unsigned", "signed", "void", "var", "function"
		].join("\x20");

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },			// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },			// strings
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' },			// keywords
		];
	}

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['js++', 'jspp', 'jpp'];

	SyntaxHighlighter.brushes.JSPP = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();