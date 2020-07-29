function customizeMonaco () {
  // Register a new language
  monaco.languages.register({ id: 'raml' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('raml', {
    numberInteger:/(?:0|[+-]?[0-9]+)/,
    numberFloat:/(?:0|[+-]?[0-9]+)(?:\.[0-9]+)?(?:e[-+][1-9][0-9]*)?/,
    numberOctal:/0o[0-7]+/,
    numberHex:/0x[0-9a-fA-F]+/,
    numberInfinity:/[+-]?\.(?:inf|Inf|INF)/,
    numberNaN:/\.(?:nan|Nan|NAN)/,
    numberDate:/\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?/,
    escapes:/\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
    keywords:["true","True","TRUE","false","False","FALSE","null","Null","Null","~"],
    brackets:[
      {token:"delimiter.bracket",open:"{",close:"}"},
      {token:"delimiter.square",open:"[",close:"]"}
    ],

    tokenizer:{
      root:[
        [/\/.*(?=:)/,"special"],
        [/#%.*/,"syntaxTag"],
        [/\![^ ]*/,"tag"],
        [/#.*/,"rootComment"],
        [/get\??:/,"methodGET"],
        [/put\??:/,"methodPUT"],
        [/post\??:/,"methodPOST"],
        [/patch\??:/,"methodPATCH"],
        [/delete\??:/,"methodDELETE"],
        [/(head|options|trace|connect)\??:/,"methodOther"],
        [/\d+:/,"statusCode"],
        [/\(.+\):/,"annotation"],
        [/\w+\/\w+:/,"contentType"],
        {include:"@comment"},
        {include:"@whitespace"},
        [/%[^ ]+.*$/,"meta.directive"],
        [/---/,"operators.directivesEnd"],
        [/\.{3}/,"operators.documentEnd"],
        [/[-?:](?= )/,"operators"],
        {include:"@anchor"},
        {include:"@tagHandle"},
        {include:"@flowCollections"},
        {include:"@blockStyle"},
        [/@numberInteger(?![ \t]*\S+)/,"number"],
        [/@numberFloat(?![ \t]*\S+)/,"number.float"],
        [/@numberOctal(?![ \t]*\S+)/,"number.octal"],
        [/@numberHex(?![ \t]*\S+)/,"number.hex"],
        [/@numberInfinity(?![ \t]*\S+)/,"number.infinity"],
        [/@numberNaN(?![ \t]*\S+)/,"number.nan"],
        [/@numberDate(?![ \t]*\S+)/,"number.date"],
        [/(".*?"|'.*?'|.*?)([ \t]*)(:)( |$)/,
          ["type","white","operators","white"]
        ],
        {include:"@flowScalars"},
        [/.+(?=#)/,{cases:{"@keywords":"keyword","@default":"string"}}],
        [/.+$/,{cases:{"@keywords":"keyword","@default":"string"}}]
      ],

      object:[
        {include:"@whitespace"},
        {include:"@comment"},
        [/\}/,"@brackets","@pop"],
        [/,/,"delimiter.comma"],
        [/:(?= )/,"operators"],
        [/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/,"type"],
        {include:"@flowCollections"},
        {include:"@flowScalars"},
        {include:"@tagHandle"},
        {include:"@anchor"},
        {include:"@flowNumber"},
        [/[^\},]+/,{cases:{"@keywords":"keyword","@default":"string"}}]
      ],

      array:[
        {include:"@whitespace"},
        {include:"@comment"},
        [/\]/,"@brackets","@pop"],
        [/,/,"delimiter.comma"],
        {include:"@flowCollections"},
        {include:"@flowScalars"},
        {include:"@tagHandle"},
        {include:"@anchor"},
        {include:"@flowNumber"},
        [/[^\],]+/,{cases:{"@keywords":"keyword","@default":"string"}}]
      ],

      multiString:[[/^( +).+$/,"string","@multiStringContinued.$1"]],

      multiStringContinued:[[
        /^( *).+$/,
        {cases:{"$1==$S2":"string","@default":{token:"@rematch",next:"@popall"}}}
      ]],

      whitespace:[[/[ \t\r\n]+/,"white"]],

      comment:[[/#.*/,"comment"]],

      flowCollections:[[/\[/,"@brackets","@array"],[/\{/,"@brackets","@object"]],

      flowScalars:[
        [/"([^"\\]|\\.)*$/,"string.invalid"],
        [/'([^'\\]|\\.)*$/,"string.invalid"],
        [/'[^']*'/,"string"],
        [/"/,"string","@doubleQuotedString"]
      ],

      doubleQuotedString:[
        [/[^\\"]+/,"string"],
        [/@escapes/,"string.escape"],
        [/\\./,"string.escape.invalid"],
        [/"/,"string","@pop"]
       ],

      blockStyle:[[/[>|][0-9]*[+-]?$/,"operators","@multiString"]],

      flowNumber:[
        [/@numberInteger(?=[ \t]*[,\]\}])/,"number"],
        [/@numberFloat(?=[ \t]*[,\]\}])/,"number.float"],
        [/@numberOctal(?=[ \t]*[,\]\}])/,"number.octal"],
        [/@numberHex(?=[ \t]*[,\]\}])/,"number.hex"],
        [/@numberInfinity(?=[ \t]*[,\]\}])/,"number.infinity"],
        [/@numberNaN(?=[ \t]*[,\]\}])/,"number.nan"],
        [/@numberDate(?=[ \t]*[,\]\}])/,"number.date"]
      ],

      tagHandle:[[/\![^ ]*/,"tag"]],

      anchor:[[/[&*][^ ]+/,"namespace"]]
    }
  });
  monaco.editor.defineTheme('ramlTheme', {
    base: 'vs-dark', // vs, hc-black, vs-dark
    inherit: true,
    rules: [{ background: 'EDF9FA' },
      {token : 'type', foreground: "#5385f3"},
      {token : 'special', foreground:'#63646a'},
      {token : 'string', foreground: '#63646a'},
      {token : 'contentType', foreground: '#63646a'},
      {token : 'keyword', foreground: '#5385f3'},
      {token : 'number', foreground: '#b99b5a'},
      {token : 'statusCode', foreground: '#b99b5a'},
      {token : 'syntaxTag', foreground: '#5385f3'},
      {token : 'tag', foreground: '#63646a'}, // Tags like !include
      {token : 'rootComment', foreground: '#5385f3'},
      {token : 'annotation', foreground: '#63646a'},

      {token : 'methodGET', foreground: '#5385f3'},
      {token : 'methodPOST', foreground: '#5385f3'},
      {token : 'methodPUT', foreground: '#5385f3'},
      {token : 'methodPATCH', foreground: '#5385f3'},
      {token : 'methodDELETE', foreground: '#5385f3'},
      {token : 'methodOther', foreground: '#5385f3'}
    ],
    colors: {
      // 'editor.foreground': '#000000',
      // 'editor.background': '#526881',
      // 'editor.lineHighlightBackground': '#4e4e4e',
      // 'editor.lineHighlightForeground': '#4e4e4e',
      // 'editor.selectionBackground': '#4e4e4e',
      // 'editor.selectionForeground': '#4e4e4e',
      // 'editor.selectionHighlightBackground': '#4e4e4e',
      // 'editor.selectionHighlightForeground': '#4e4e4e',
      // 'editor.inactiveSelectionBackground': '#4e4e4e',
      // 'editor.hoverHighlightBackground': '#4e4e4e',
      // 'editor.hoverHighlightForeground': '#4e4e4e',
      // 'editorCursor.foreground': '#8B0000',
      // 'editorLineNumber.foreground': '#008800',
      // 'input.background': '#FFFFFF',
      // 'editorHoverWidget.background': '#F7FAFF',
      // 'editorHoverWidget.border': '#4e4e4e',
      // 'editorIndentGuide.background': '#9EAAB7'
    }
  });
  monaco.editor.setTheme('ramlTheme');
}
