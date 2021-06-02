import * as ace from 'brace';

ace.define('ace/mode/utterance_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (req, exports) => {
  const oop = req('../lib/oop');
  const { TextHighlightRules } = req('./text_highlight_rules');

  const UtteranceHighlightRules = function () {
    this.$rules = { start: [{ token: 'utterance', regex: '{(.*?)}' }] };

    this.normalizeRules();
  };

  oop.inherits(UtteranceHighlightRules, TextHighlightRules);

  exports.UtteranceHighlightRules = UtteranceHighlightRules;
});

ace.define(
  'ace/mode/utterance',
  ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/utterance_highlight_rules'],
  (req, exports) => {
    const oop = req('../lib/oop');
    const TextMode = req('./text').Mode;
    const { UtteranceHighlightRules } = req('./utterance_highlight_rules');

    const Mode = function () {
      this.HighlightRules = UtteranceHighlightRules;
      this.$behaviour = this.$defaultBehaviour;
    };

    oop.inherits(Mode, TextMode);

    Mode.prototype.$id = 'ace/mode/utterance';

    exports.Mode = Mode;
  }
);
