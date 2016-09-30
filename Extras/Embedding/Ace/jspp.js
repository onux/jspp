define('ace/mode/jspp', function(require, exports, module) {

  var oop = require('ace/lib/oop');
  var TextMode = require('ace/mode/text').Mode;
  var JsppHighlightRules = require('ace/mode/jspp_highlight_rules').JsppHighlightRules;
  var MatchingBraceOutdent = require('ace/mode/matching_brace_outdent').MatchingBraceOutdent;
  var CstyleBehaviour = require('ace/mode/behaviour/cstyle').CstyleBehaviour;
  var CStyleFoldMode = require('ace/mode/folding/cstyle').FoldMode;

  var Mode = function() {
    this.HighlightRules = JsppHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
  };
  oop.inherits(Mode, TextMode);

  (function() {
    this.lineCommentStart = '//';
    this.blockComment = {start: '/*', end: '*/'};

    this.getNextLineIndent = function(state, line, tab) {
      var indent = this.$getIndent(line);
      var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
      var tokens = tokenizedLine.tokens;
      var endState = tokenizedLine.state;
      if (tokens.length && tokens[tokens.length-1].type == 'comment') {
          return indent;
      }
      if (state == 'start') {
          var match = line.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/);
          if (match) {
              indent += tab;
          }
      }
      return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = 'ace/mode/jspp';
  }).call(Mode.prototype);
  exports.Mode = Mode;
});
