define('ace/mode/jspp', function(require, exports, module) {

  var oop = require('ace/lib/oop');
  var TextMode = require('ace/mode/text').Mode;
  var JsppHighlightRules = require('ace/mode/jspp_highlight_rules').JsppHighlightRules;
  var MatchingBraceOutdent = require('ace/mode/matching_brace_outdent').MatchingBraceOutdent;
  var CstyleBehaviour = require('ace/mode/behaviour/cstyle').CstyleBehaviour;
  var CStyleFoldMode = require('ace/mode/folding/cstyle').FoldMode;
  var Range = require("ace/range").Range;

  var Mode = function() {
    this.HighlightRules = JsppHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
    this.foldingRules._jsppFoldableStrings = {
      double_quoted_string: '"""',
      single_quoted_string: "'''"
    };
    this.foldingRules._getFoldWidgetCStyle = this.foldingRules.getFoldWidget;
    this.foldingRules.getFoldWidget = function(session, foldStyle, row) {
      var st = session.getState(row);
      if (st in this._jsppFoldableStrings) {
        return session.getLine(row).match(this._jsppFoldableStrings[st])? 'start': '';
      }
      return this._getFoldWidgetCStyle(session, foldStyle, row);
    };
    this.foldingRules._getFoldWidgetRangeCStyle = this.foldingRules.getFoldWidgetRange;
    this.foldingRules.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
      var marker, sMatch, eMatch, i, st = session.getState(row);
      if (st in this._jsppFoldableStrings) {
        marker = this._jsppFoldableStrings[st];
        sMatch = session.getLine(row).match(marker);
        if (sMatch) {
          for (i = row + 1; i < session.getLength(); i++) {
            eMatch = session.getLine(i).match(marker);
            if (eMatch) {
              return new Range(row, sMatch.index + marker.length, i, eMatch.index);
            }
          }
        }
      }
      return this._getFoldWidgetRangeCStyle(session, foldStyle, row, forceMultiline);
    };
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
