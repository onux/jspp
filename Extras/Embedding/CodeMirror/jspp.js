CodeMirror.defineSimpleMode('jspp', {
    start: [
        {regex: /"""/, token: 'string', next: 'double_quoted_string'},
        {regex: /'''/, token: 'string', next: 'single_quoted_string'},
        {regex: /"(?:[^\\]|\\.)*?"/, token: 'string'},
        {regex: /'(?:[^\\]|\\.)*?'/, token: 'string'},
        {regex: /"(?:[^\\]|\\.)*?\\$/, token: 'string', next: 'double_quoted_hack_string'},
        {regex: /'(?:[^\\]|\\.)*?\\$/, token: 'string', next: 'single_quoted_hack_string'},
        {regex: /`(?:[^\\]|\\(.|x[0-9a-f]{2}|u[0-9a-f]{4}))`/i, token: 'string'},
        {regex: /(?:if|in|do|for|new|try|let|this|else|case|with|while|break|catch|throw|const|yield|return)\b/,
            token: 'keyword'},
        {regex: /(?:typeof|delete|switch|default|finally|continue|debugger|instanceof|export)\b/, token: 'keyword'},
        {regex: /(?:import|external|foreach|typeid|super|implicit|explicit)\b/, token: 'keyword'},
        {regex: /(?:var|function|bool|string|byte|short|int|long|float|double|char|void|signed|unsigned|auto)\b/,
            token: 'keyword'},
        {regex: /(?:private|protected|public|static|final|inline|property|abstract|optional|virtual|override)\b/,
            token: 'keyword'},
        {regex: /(?:true|false|null|undefined)\b/, token: 'atom'},
        {regex: /(class|interface|enum|extends|implements)(\s+)([A-Za-z$][\w$]*)(\<[\w\s\<\>\,\.\(\)]+\>)*/,
            token: ['keyword', null, 'def', 'def']},
        {regex: /(module|package)(\s+)([A-Za-z$][\w\.$]*)/, token: ['keyword', null, 'def']},
        {regex: /0[Xx][A-Fa-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:[Ee][-+]?\d+|[FfDdL]|UL)?/, token: 'number'},
        {regex: /\/\/.*/, token: 'comment'},
        {regex: /\/\*.*?\*\//, token: 'comment'},
        {regex: /\/\*\*/, token: 'comment', next: 'doc_comment'},
        {regex: /\/\*/, token: 'comment', next: 'comment'},
        {regex: /(\w+)([\s\)]*)([\/])/, token: ['variable', null, 'operator']},
        {regex: /\/[^\*](?:[^\\]|\\.)*?\/[a-z]*/, token: 'string'},
        {regex: /[\{\[\(]/, indent: true},
        {regex: /[\}\]\)]/, dedent: true},
        {regex: /[a-z$][\w$]*/i, token: 'variable'},
    ],
  
    doc_comment: [
        {regex: /(.*)(@\w+)/, token: ['comment', 'def']},
        {regex: /(.*)({{.*}})/, token: ['comment', 'keyword']},
        {regex: /.*?\*\//, token: 'comment', next: 'start'},
        {regex: /.*/, token: 'comment'},
    ],
  
    comment: [
        {regex: /.*?\*\//, token: 'comment', next: 'start'},
        {regex: /.*/, token: 'comment'},
    ],
  
    double_quoted_string: [
        {regex: /.*?"""/, token: 'string', next: 'start'},
        {regex: /.*/, token: 'string'},
    ],
  
    single_quoted_string: [
        {regex: /.*?'''/, token: 'string', next: 'start'},
        {regex: /.*/, token: 'string'},
    ],
  
    double_quoted_hack_string: [
        {regex: /(?:[^\\]|\\.)*?"/, token: 'string', next: 'start'},
        {regex: /(?:[^\\]|\\.)*?\\$/, token: 'string'},
    ],
  
    single_quoted_hack_string: [
        {regex: /(?:[^\\]|\\.)*?'/, token: 'string', next: 'start'},
        {regex: /(?:[^\\]|\\.)*?\\$/, token: 'string'},
    ],
  
    meta: {
        dontIndentStates: [
            'doc_comment', 'comment', 'double_quoted_string', 'single_quoted_string', 'double_quoted_hack_string',
            'single_quoted_hack_string',
        ],
        lineComment: '//',
        fold: 'brace',
    },
});
