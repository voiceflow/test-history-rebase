/* eslint-disable global-require */
import * as ace from 'brace';

ace.define(
  'ace/mode/json_custom_highlight_rules',
  ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'],
  (acequire, exports) => {
    const oop = acequire('../lib/oop');
    const { TextHighlightRules } = acequire('./text_highlight_rules');

    const json_customHighlightRules = function () {
      this.$rules = {
        start: [
          {
            token: 'custom_variable',
            regex: '\\{[\\w\\d]+\\}',
          },
          {
            token: 'string', // single line
            regex: '"',
            next: 'string',
          },
          {
            token: 'constant.numeric', // hex
            regex: '0[xX][0-9a-fA-F]+\\b',
          },
          {
            token: 'constant.numeric', // float
            regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b',
          },
          {
            token: 'constant.language.boolean',
            regex: '(?:true|false)\\b',
          },
          {
            token: 'text', // single quoted strings are not allowed
            regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
          },
          {
            token: 'comment', // comments are not allowed, but who cares?
            regex: '\\/\\/.*$',
          },
          {
            token: 'comment.start', // comments are not allowed, but who cares?
            regex: '\\/\\*',
            next: 'comment',
          },
          {
            token: 'variable', // single line
            regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]\\s*(?=:)',
          },
          {
            token: 'paren.lparen',
            regex: '[[({]',
          },
          {
            token: 'paren.rparen',
            regex: '[\\])}]',
          },
          {
            token: 'text',
            regex: '\\s+',
          },
        ],
        string: [
          {
            token: 'constant.language.escape',
            regex: /\\(?:x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|["/\\bfnrt])/,
          },
          {
            token: 'string',
            regex: '"|$',
            next: 'start',
          },
          {
            defaultToken: 'string',
          },
        ],
        comment: [
          {
            token: 'comment.end', // comments are not allowed, but who cares?
            regex: '\\*\\/',
            next: 'start',
          },
          {
            defaultToken: 'comment',
          },
        ],
      };
    };

    oop.inherits(json_customHighlightRules, TextHighlightRules);

    exports.json_customHighlightRules = json_customHighlightRules;
  }
);

ace.define('ace/mode/matching_brace_outdent', ['require', 'exports', 'module', 'ace/range'], (acequire, exports) => {
  const { Range } = acequire('../range');

  const MatchingBraceOutdent = function () {};

  MatchingBraceOutdent.prototype.checkOutdent = function (line, input) {
    if (!/^\s+$/.test(line)) return false;

    return /^\s*}/.test(input);
  };

  // eslint-disable-next-line consistent-return
  MatchingBraceOutdent.prototype.autoOutdent = function (doc, row) {
    const line = doc.getLine(row);
    const match = line.match(/^(\s*})/);

    if (!match) return 0;

    const column = match[1].length;
    const openBracePos = doc.findMatchingBracket({ row, column });

    // eslint-disable-next-line eqeqeq
    if (!openBracePos || openBracePos.row == row) return 0;

    const indent = this.$getIndent(doc.getLine(openBracePos.row));
    doc.replace(new Range(row, 0, row, column - 1), indent);
  };

  MatchingBraceOutdent.prototype.$getIndent = (line) => line.match(/^\s*/)[0];

  exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

ace.define(
  'ace/mode/folding/cstyle',
  ['require', 'exports', 'module', 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'],
  (acequire, exports) => {
    const oop = acequire('../../lib/oop');
    const { Range } = acequire('../../range');
    const BaseFoldMode = acequire('./fold_mode').FoldMode;

    // eslint-disable-next-line no-multi-assign
    const FoldMode = (exports.FoldMode = function (commentRegex) {
      if (commentRegex) {
        this.foldingStartMarker = new RegExp(
          this.foldingStartMarker.source.replace(/\|[^|]*?$/, `|${commentRegex.start}`)
        );
        this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, `|${commentRegex.end}`));
      }
    });
    oop.inherits(FoldMode, BaseFoldMode);

    FoldMode.prototype.foldingStartMarker = /([([{])[^)\]}]*$|^\s*(\/\*)/;
    FoldMode.prototype.foldingStopMarker = /^[^([{]*([)\]}])|^[\s*]*(\*\/)/;
    FoldMode.prototype.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
    FoldMode.prototype.tripleStarBlockCommentRe = /^\s*(\/\*{3}).*\*\/\s*$/;
    FoldMode.prototype.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    FoldMode.prototype._getFoldWidgetBase = FoldMode.prototype.getFoldWidget;
    FoldMode.prototype.getFoldWidget = function (session, foldStyle, row) {
      const line = session.getLine(row);

      if (
        this.singleLineBlockCommentRe.test(line) &&
        !this.startRegionRe.test(line) &&
        !this.tripleStarBlockCommentRe.test(line)
      ) {
        return '';
      }

      const fw = this._getFoldWidgetBase(session, foldStyle, row);

      if (!fw && this.startRegionRe.test(line)) return 'start'; // lineCommentRegionStart

      return fw;
    };

    // eslint-disable-next-line consistent-return
    FoldMode.prototype.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
      const line = session.getLine(row);

      if (this.startRegionRe.test(line)) return this.getCommentRegionBlock(session, line, row);

      let match = line.match(this.foldingStartMarker);
      if (match) {
        const i = match.index;

        if (match[1]) return this.openingBracketBlock(session, match[1], row, i);

        let range = session.getCommentFoldRange(row, i + match[0].length, 1);

        if (range && !range.isMultiLine()) {
          if (forceMultiline) {
            range = this.getSectionRange(session, row);
          } else if (foldStyle !== 'all') range = null;
        }

        return range;
      }

      // eslint-disable-next-line consistent-return
      if (foldStyle === 'markbegin') return;

      match = line.match(this.foldingStopMarker);
      if (match) {
        const i = match.index + match[0].length;

        if (match[1]) return this.closingBracketBlock(session, match[1], row, i);

        return session.getCommentFoldRange(row, i, -1);
      }
    };

    FoldMode.prototype.getSectionRange = function (session, row) {
      let line = session.getLine(row);
      const startIndent = line.search(/\S/);
      const startRow = row;
      const startColumn = line.length;
      row += 1;
      let endRow = row;
      const maxRow = session.getLength();
      while (++row < maxRow) {
        line = session.getLine(row);
        const indent = line.search(/\S/);
        if (indent === -1) continue;
        if (startIndent > indent) break;
        const subRange = this.getFoldWidgetRange(session, 'all', row);

        if (subRange) {
          if (subRange.start.row <= startRow) {
            break;
          } else if (subRange.isMultiLine()) {
            row = subRange.end.row;
            // eslint-disable-next-line eqeqeq
          } else if (startIndent == indent) {
            break;
          }
        }
        endRow = row;
      }

      return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    // eslint-disable-next-line consistent-return
    FoldMode.prototype.getCommentRegionBlock = function (session, line, row) {
      const startColumn = line.search(/\s*$/);
      const maxRow = session.getLength();
      const startRow = row;

      const re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
      let depth = 1;
      while (++row < maxRow) {
        line = session.getLine(row);
        const m = re.exec(line);
        if (!m) continue;
        if (m[1]) depth--;
        else depth++;

        if (!depth) break;
      }

      const endRow = row;
      if (endRow > startRow) {
        return new Range(startRow, startColumn, endRow, line.length);
      }
    };
  }
);

ace.define(
  'ace/mode/json_custom',
  [
    'require',
    'exports',
    'module',
    'ace/lib/oop',
    'ace/mode/text',
    'ace/mode/json_custom_highlight_rules',
    'ace/mode/matching_brace_outdent',
    'ace/mode/behaviour/cstyle',
    'ace/mode/folding/cstyle',
    'ace/worker/worker_client',
  ],
  (acequire, exports) => {
    const oop = acequire('../lib/oop');
    const TextMode = acequire('./text').Mode;
    const HighlightRules = acequire('./json_custom_highlight_rules').json_customHighlightRules;
    const { MatchingBraceOutdent } = acequire('./matching_brace_outdent');
    const { CstyleBehaviour } = acequire('./behaviour/cstyle');
    const CStyleFoldMode = acequire('./folding/cstyle').FoldMode;
    const { WorkerClient } = acequire('../worker/worker_client');

    const Mode = function () {
      this.HighlightRules = HighlightRules;
      this.$outdent = new MatchingBraceOutdent();
      this.$behaviour = new CstyleBehaviour();
      this.foldingRules = new CStyleFoldMode();
    };
    oop.inherits(Mode, TextMode);

    Mode.prototype.getNextLineIndent = function (state, line, tab) {
      let indent = this.$getIndent(line);

      if (state === 'start') {
        const match = line.match(/^.*[([{]\s*$/);
        if (match) {
          indent += tab;
        }
      }

      return indent;
    };

    Mode.prototype.checkOutdent = function (state, line, input) {
      return this.$outdent.checkOutdent(line, input);
    };

    Mode.prototype.autoOutdent = function (state, doc, row) {
      this.$outdent.autoOutdent(doc, row);
    };

    Mode.prototype.createWorker = function (session) {
      const worker = new WorkerClient(['ace'], require('brace/worker/json'), 'jsonWorker');
      worker.attachToDocument(session.getDocument());

      worker.on('annotate', (e) => {
        session.setAnnotations(e.data);
      });

      worker.on('terminate', () => {
        session.clearAnnotations();
      });

      return worker;
    };

    Mode.prototype.$id = 'ace/mode/json_custom';

    exports.Mode = Mode;
  }
);
