import * as ace from 'brace';

ace.define(
  'ace/mode/slot_highlight_rules',
  ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'],
  (req, exports) => {
    const oop = req('../lib/oop');
    const { TextHighlightRules } = req('./text_highlight_rules');

    const SlotHighlightRules = function () {
      this.$rules = { start: [{ token: 'slot', regex: '^(.*?)(?=,|$)' }] };

      this.normalizeRules();
    };

    oop.inherits(SlotHighlightRules, TextHighlightRules);

    exports.SlotHighlightRules = SlotHighlightRules;
  }
);

ace.define(
  'ace/mode/slot',
  ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/slot_highlight_rules'],
  (req, exports) => {
    const oop = req('../lib/oop');
    const TextMode = req('./text').Mode;
    const { SlotHighlightRules } = req('./slot_highlight_rules');

    const Mode = function () {
      this.HighlightRules = SlotHighlightRules;
      this.$behaviour = this.$defaultBehaviour;
    };

    oop.inherits(Mode, TextMode);

    Mode.prototype.$id = 'ace/mode/slot';

    exports.Mode = Mode;
  }
);
