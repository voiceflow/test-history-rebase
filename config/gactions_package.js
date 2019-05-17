const {
  BUILT_IN_INTENTS_GOOGLE,
} = require('../app/src/Constants');
const _ = require('lodash');
const {
  getUtterancesWithSlotNames,
  formatName,
  getSlotsForKeysAndFormat,
} = require('../app/src/intent_util');

const generateDialogflowPackage = (params) => {
  const { intents } = params;
  const { slots } = params;
  const { used_intents } = params;
  const platform = 'google';

  const intents_for_google = [];
  const slots_for_google = [];
  const entered_intents = new Set();
  const used_slots = new Set();

  used_intents.forEach((intent_key) => {
    if (typeof intent_key !== 'string') return;

    let intent;
    if (intent_key.startsWith('actions.intent.')) {
      intent = _.find(BUILT_IN_INTENTS_GOOGLE, {
        name: intent_key,
      });
      intent.built_in = true;
    } else {
      intent = _.find(intents, {
        key: intent_key,
      });
    }

    if (!intent) {
      return;
    }

    const name = formatName(intent.name);

    if (!entered_intents.has(name)) {
      entered_intents.add(name);

      const formatted_intent = {
        name,
      };

      if (!intent.built_in) {
        const slot_keys = intent.inputs.map((input) => input.slots);

        formatted_intent.samples = getUtterancesWithSlotNames(intent.inputs, slots, false, true);
        formatted_intent.slots = getSlotsForKeysAndFormat(slot_keys, slots, platform);

        slot_keys.forEach((key_arr) => {
          key_arr.forEach((key) => used_slots.add(key));
        });
      }
      intents_for_google.push(formatted_intent);
    }
  });

  used_slots.forEach((slot_key) => {
    const slot = _.find(slots, {
      key: slot_key,
    });
    if (slot.type.value.toLowerCase() === 'custom') {
      slots_for_google.push({
        name: null,
        displayName: slot.name,
        kind: null,
        entities: slot.inputs.map((input) => {
          const input_arr = input.split(',').map((e) => e.trim());

          return {
            value: input_arr[0],
            synonyms: input_arr,
          };
        }),
      });
    }
  });

  return {
    intents: intents_for_google,
    slots: slots_for_google,
  };
};

module.exports.generateDialogflowPackage = generateDialogflowPackage;
