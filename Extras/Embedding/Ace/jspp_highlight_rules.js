define('ace/mode/jspp_highlight_rules', function(require, exports, module) {

  var oop = require('ace/lib/oop');

  var TextHighlightRules = require('ace/mode/text_highlight_rules').TextHighlightRules;

  var JsppHighlightRules = function() {

    this.$rules = {
      start: [
        {regex: /"""/, token: 'string.quoted.triple', next: 'double_quoted_string'},
        {regex: /'''/, token: 'string.quoted.triple', next: 'single_quoted_string'},
        {regex: /"(?:[^\\]|\\.)*?"/, token: 'string.quoted.double'},
        {regex: /'(?:[^\\]|\\.)*?'/, token: 'string.quoted.single'},
        {regex: /"(?:[^\\]|\\.)*?\\$/, token: 'string.quoted.double', next: 'double_quoted_hack_string'},
        {regex: /'(?:[^\\]|\\.)*?\\$/, token: 'string.quoted.single', next: 'single_quoted_hack_string'},
        {regex: /`(?:[^\\]|\\(.|[Xx][0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}))`/, token: 'string.quoted.other'},
        {regex: /(?:if|in|do|for|try|let|else|case|with|while|break|catch|throw|foreach|yield|return)\b/,
            token: 'keyword.control'},
        {regex: /(?:this)\b/, token: 'variable.language'},
        {regex: /(?:typeof|delete|switch|default|finally|continue|debugger|instanceof|export)\b/, token: 'keyword'},
        {regex: /(?:import|new|const|typeid|super)\b/, token: 'keyword'},
        {regex: /(?:external|implicit|explicit)\b/, token: 'storage.modifier'},
        {regex: /(?:var|function|bool|string|byte|short|int|long|float|double|char|void|signed|unsigned)\b/,
            token: 'storage.type'},
        {regex: /(?:private|protected|public|static|final|inline|property|abstract|optional|virtual|override)\b/,
            token: 'storage.modifier'},
        {regex: /(?:true|false|null|undefined)\b/, token: 'constant.language'},
        {regex: /(class|interface|enum)(\s+)([A-Za-z$][\w$]*)(\<[\w\s\<\>\,\.\(\)]+\>)*/,
            token: ['storage.type', 'text', 'variable', 'variable']},
        {regex: /(extends|implements)(\s+)([A-Za-z$][\w$]*)(\<[\w\s\<\>\,\.\(\)]+\>)*/,
            token: ['keyword', 'text', 'variable', 'variable']},
        {regex: /(module|package)(\s+)([A-Za-z$][\w\.$]*)/, token: ['storage.type', 'text', 'variable']},
        {regex: /0[Xx][A-Fa-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:[Ee][-+]?\d+|[FfDdL]|UL)?/, token: 'constant.numeric'},
        {regex: /\/\/.*/, token: 'comment.line'},
        {regex: /\/\*.*?\*\//, token: 'comment.block'},
        {regex: /\/\*\*/, token: 'comment.doc', next: 'doc_comment'},
        {regex: /\/\*/, token: 'comment.block', next: 'comment'},
        {regex: /(\w+)([\s\)]*)([\/])/, token: ['text', 'text', 'text']},
        {regex: /\/[^\*](?:[^\\]|\\.)*?\/[a-z]*/, token: 'string.regexp'},
        {regex: /[\{\[\(]/, token: 'paren'},
        {regex: /[\}\]\)]/, token: 'paren'},
        {regex: /[A-Za-z$][\w$]*/, token: 'text'},
      ],
  
      doc_comment: [
        {regex: /(.*)(@\w+)/, token: ['comment.doc', 'comment.doc.tag']},
        {regex: /(.*)({{.*}})/, token: ['comment.doc', 'comment.doc.tag']},
        {regex: /.*?\*\//, token: 'comment.doc', next: 'start'},
        {regex: /.*/, token: 'comment.doc'},
      ],
  
      comment: [
        {regex: /.*?\*\//, token: 'comment.block', next: 'start'},
        {regex: /.*/, token: 'comment.block'},
      ],
  
      double_quoted_string: [
        {regex: /.*?"""/, token: 'string.quoted.triple', next: 'start'},
        {regex: /.*/, token: 'string.quoted.triple'},
      ],
  
      single_quoted_string: [
        {regex: /.*?'''/, token: 'string.quoted.triple', next: 'start'},
        {regex: /.*/, token: 'string.quoted.triple'},
      ],
  
      double_quoted_hack_string: [
        {regex: /(?:[^\\]|\\.)*?"/, token: 'string.quoted.double', next: 'start'},
        {regex: /(?:[^\\]|\\.)*?\\$/, token: 'string.quoted.double'},
      ],
  
      single_quoted_hack_string: [
        {regex: /(?:[^\\]|\\.)*?'/, token: 'string.quoted.single', next: 'start'},
        {regex: /(?:[^\\]|\\.)*?\\$/, token: 'string.quoted.single'},
      ],
    } 
  }
  oop.inherits(JsppHighlightRules, TextHighlightRules);
  exports.JsppHighlightRules = JsppHighlightRules;
});
