const _ = require('lodash');
const {
  BUILT_IN_INTENTS_ALEXA,
  DEFAULT_INTENTS,
  INTERFACE_INTENTS,
  CATCH_ALL_INTENT,
} = require('./Constants');
const {
  getUtterancesWithSlotNames,
  formatName,
  getSlotsForKeysAndFormat,
  parseChoiceInput,
  stripSample,
  utteranceToIntentName,
  getSlotType,
  findSlot,
} = require('../app/src/util');
const randomstring = require('randomstring');
const stringSimilarity = require('string-similarity');

const addSlots = (extracted_slots, intent, existing) => {
  if (extracted_slots.length !== 0) {
    const existing_slots = new Set(intent.slots.map((s) => s.name));
    for (const extracted_slot of extracted_slots) {
      if (!existing_slots.has(extracted_slot.name)) {
        // slot currently doesn't exist in this intent
        existing_slots.add(extracted_slot.name);
        existing.add(extracted_slot.name);
        intent.slots.push(extracted_slot);
      }
    }
  }
};

const testSlotOnlyIntent = (utterance, slot_dict, capture_intents) => {
  // determine if this intent has a {slot only} utterance
  let type;
  const remove_slots = utterance.replace(/\{([a-zA-Z_]{1,170})\}/, (match, inner) => {
    if (inner in slot_dict) {
      type = slot_dict[inner];
      return '';
    }
    return match;
  });
  // string should be an empty string after removing an intent
  if (!remove_slots.trim() && type) {
    capture_intents.add(type);
  }
};

const generateRandomName = (prefix, used_slots) => {
  // get a unique slot name
  let slot_name;
  do {
    slot_name = `${prefix}${randomstring.generate({ length: 5, charset: 'alphabetic', capitalization: 'lowercase' })}`;
  } while (used_slots.has(slot_name));
  return slot_name;
};

exports.createInteractionModel = (req, locale) => {
  // console.log("PERFORMANCE START"); let time = Date.now()
  const invocation = req.inv_name;
  const { intents } = req;
  const { slots } = req;
  let { used_choices } = req;
  const { used_intents } = req;
  const platform = 'alexa';

  const intents_for_amazon = [];
  const slot_intents = [];
  const entered_intents = new Set();
  const used_slots = new Set();
  const capture_intents = new Set();
  // DICTIONARY OF ALL DEFINED UTTERANCES TO THEIR INTENT OBJECT
  const samples = {};
  const LOCALE_DEFAULTS = _.cloneDeep(DEFAULT_INTENTS[locale.substring(0, 2)]);
  const LOCALE_DEFAULT_SET = {};

  const used_built_ins = new Set();
  // Add in the repeat intent if it is needed
  if (typeof req.repeat === 'number' && req.repeat > 0) {
    used_built_ins.add('AMAZON.RepeatIntent');
  }

  // IF BUILD INS WERE DECLARED BEFORE THIS BLOCK, THEY WILL BE ADDED IN
  // Write in default intents
  ['defaults', 'built_ins'].forEach((type) => {
    LOCALE_DEFAULTS[type].forEach((intent) => {
      // don't log built_ins because they might not be needed
      if (type === 'defaults' || used_built_ins.has(intent.name)) {
        entered_intents.add(intent.name);
        intents_for_amazon.push(intent);
      }
      for (const sample of intent.samples) {
        samples[stripSample(sample)] = intent;
      }
      LOCALE_DEFAULT_SET[intent.name] = new Set(intent.samples);
    });
  });

  // Add in the fallback intent by default if in English Region
  if (locale && locale.includes('en')) {
    if (!entered_intents.has('AMAZON.FallbackIntent')) {
      entered_intents.add('AMAZON.FallbackIntent');
      intents_for_amazon.push({
        name: 'AMAZON.FallbackIntent',
      });
    }
  }

  // INTERFACE REQUIRED INTENTS
  if (Array.isArray(req.alexa_interfaces)) {
    for (const _interface of req.alexa_interfaces) {
      if (INTERFACE_INTENTS[_interface]) {
        INTERFACE_INTENTS[_interface].forEach((i) => {
          intents_for_amazon.push(i);
          entered_intents.add(i.name);
        });
      }
    }
  }

  // iterate through all of the used intents and get their slots
  used_intents.forEach((intent_key) => {
    if (typeof intent_key !== 'string') return;

    let intent;
    if (intent_key.startsWith('CUSTOM:') || intent_key.startsWith('CAPTURE:')) {
      slot_intents.push(intent_key);
      return;
    } if (intent_key.startsWith('AMAZON.')) {
      intent = _.find(BUILT_IN_INTENTS_ALEXA, {
        name: intent_key,
      });
      intent.built_in = true;
    } else {
      intent = _.find(intents, {
        key: intent_key,
      });
    }

    if (!intent) return;

    const name = formatName(intent.name);

    if (!entered_intents.has(name)) {
      entered_intents.add(name);

      const formatted_intent = {
        name,
      };

      if (!intent.built_in) {
        formatted_intent.samples = getUtterancesWithSlotNames(intent.inputs, slots, false, true);
        formatted_intent.slots = getSlotsForKeysAndFormat(intent.inputs.map((input) => input.slots), slots, platform);

        const slot_dict = {};
        for (const slot of formatted_intent.slots) {
          if (slot.type) {
            slot_dict[slot.name] = slot.type;
            used_slots.add(slot.type);
          }
        }
        for (const sample of formatted_intent.samples) {
          if (formatted_intent.slots.length !== 0) {
            testSlotOnlyIntent(sample, slot_dict, capture_intents);
          }
          // don't override default intents. i.e. "help" in a choice should always be associated with the help intent"
          const stripped = stripSample(sample);
          if (!(stripped in samples)) samples[stripped] = formatted_intent;
        }
      } else {
        formatted_intent.samples = [];
      }
      intents_for_amazon.push(formatted_intent);
    }
  });

  // Push a sample and its associated slots into an intent
  const pushToIntent = (input_object, intent) => {
    if (Array.isArray(intent.slots)) {
      // Add any new slots to this intent
      addSlots(input_object.extracted_slots, intent, used_slots);
      if (intent.slots.length !== 0) {
        // check if this is an capture type utterance
        const slot_dict = {};
        intent.slots.forEach((s) => (slot_dict[s.name] = s.type));
        testSlotOnlyIntent(input_object.formatted_input, slot_dict, capture_intents);
      }
    } else {
      // only default intents should not have slots
      input_object.formatted_input = input_object.formatted_input.replace(/(\{|\})/g, '').replace(/_/g, ' ');
    }

    samples[input_object.stripped] = intent;
    // Add input to intent sample and stripped version to dictionary of used samples
    intent.samples.push(input_object.formatted_input);
    if (!entered_intents.has(intent.name)) {
      entered_intents.add(intent.name);
      intents_for_amazon.push(intent);
    }
  };

  // Make this faster
  if (used_choices.length !== 0) {
    used_choices = used_choices.map((c) => {
      if (c.length === 1) return [1, c];
      let sum = 0;
      let num = 0;
      for (let i = 0; i < c.length; i++) {
        for (let k = i + 1; k < c.length; k++) {
          num++;
          sum += stringSimilarity.compareTwoStrings(c[i].toLowerCase(), c[k].toLowerCase());
        }
      }
      return [sum / num, c];
    }).sort((i, k) => (k[0] - i[0])).map((c) => c[1]);
  }

  // ALEXA "INTENT OPTIMIZATION ENGINE" FOR
  // INTENTS FIRST THEN SLOTS
  // We only need a second pass if there are choice blocks
  let choice_count = 0;
  for (const choice of used_choices) {
    // UNION CHOICES INTO INTENTS AND SHIT HERE
    // COMPARE EACH OPTION OF THE CHOICE INPUT TO ALL EXISTING INTENTS AND THEIR SYNONYMS
    const matched = [];
    const parsed_inputs = [];

    const stripped_set = new Set();

    for (const input of choice) {
      // TODO: PREPARE FOR AMAZON DEFAULT INTENTS
      // returns parsed_input to {formatted_input, extracted_slots}
      const parsed_input = parseChoiceInput(input, slots);
      const stripped = stripSample(parsed_input.formatted_input);
      if (!parsed_input.formatted_input.trim()) continue;

      // prevent duplicates in utterances
      if (stripped_set.has(stripped)) {
        continue;
      } else {
        stripped_set.add(stripped);
      }

      parsed_input.stripped = stripped;

      // there already exists an intent similar enough to this function
      if (samples[stripped] !== undefined) {
        // since it is a match we don't have to do a parsed input check
        matched.push(samples[stripped]);
      } else {
        parsed_inputs.push(parsed_input);
      }
    }

    // Only one match
    if (matched.length === 1) {
      for (const parsed_input of parsed_inputs) {
        pushToIntent(parsed_input, matched[0]);
        choice_count++;
      }
    } else if (matched.length > 1) {
      // EDGE EDGE CASE
      // time to jaccard this boi - each input can go into a different intent based on fuzzy search
      for (const parsed_input of parsed_inputs) {
        let best = null;
        let high = -1;

        for (const match of matched) {
          // if(!Array.isArray(match.samples)){console.log(match); continue}

          let i; let
            sum = 0;
          for (i = 0; i < match.samples.length; i++) {
            sum += stringSimilarity.compareTwoStrings(parsed_input.formatted_input.toLowerCase(), match.samples[0].toLowerCase());
          }
          const avg = sum / i;
          if (avg > high) {
            high = avg;
            best = match;
          }
          // high enough threshold
          if (avg > 0.9) break;
        }

        if (best) {
          pushToIntent(parsed_input, best);
          choice_count++;
        }
      }
    } else if (parsed_inputs.length !== 0) {
      // No match so time to safely create your own intent - only problem to worry about is coming up with a name
      const name = utteranceToIntentName(parsed_inputs[0].formatted_input, entered_intents);
      entered_intents.add(name);
      const extracted_slots = [];
      const intent = {
        name,
        samples: [],
      };

      parsed_inputs.forEach((p) => {
        samples[p.stripped] = intent;
        intent.samples.push(p.formatted_input);

        const slot_dict = {};
        p.extracted_slots.forEach((s) => {
          slot_dict[s.name] = s.type;
          extracted_slots.push(s);
          used_slots.add(s.name);
        });

        // check if capture type block
        if (p.extracted_slots.length !== 0) {
          testSlotOnlyIntent(p.formatted_input, slot_dict, capture_intents);
        }
      });

      intent.slots = extracted_slots;

      intents_for_amazon.push(intent);
      choice_count++;
    }
  }

  const slot_types = [];
  const slot_utterances = new Set();
  // Add all the slots to the interaction model
  slots.forEach((slot) => {
    if (Array.isArray(slot.inputs) && slot.inputs.length !== 0) {
      const slot_name = (!slot.type.value || slot.type.value.toLowerCase() === 'custom') ? slot.name : findSlot(slot.type.value, 'alexa');

      // Don't add the slot if it ain't used
      if (!slot_name || !used_slots.has(slot_name)) {
        return;
      }

      const values = slot.inputs.map((input) => {
        slot_utterances.add(stripSample(input));
        const input_arr = input.split(',').map((e) => e.trim());
        return {
          name: {
            value: input_arr[0],
            synonyms: input_arr.length > 1 ? input_arr.slice(1) : undefined,
          },
        };
      });
      if (values.length === 0) {
        values.push({
          name: {
            value: 'empty',
          },
        });
      }
      slot_types.push({
        name: slot_name,
        values,
      });
    }
  });

  // UNION SIMILAR SLOTS FOR CATCHALL/CAPTURE
  slot_intents.forEach((slot) => {
    if (slot.startsWith('CUSTOM:')) {
      const utterances = JSON.parse(slot.substring(7));
      const unique_utterances = [];
      // check if there are already slots that have this utterance
      for (const sample of utterances) {
        const stripped = stripSample(sample);
        if (!slot_utterances.has(stripped)) {
          slot_utterances.add(stripped);
          unique_utterances.push(sample);
        }
      }
      // uh oh looks like it's time to create a new intent just for this slot
      if (unique_utterances.length !== 0) {
        const intent_name = utteranceToIntentName(`capture_${unique_utterances[0]}`, entered_intents);
        entered_intents.add(intent_name);

        const slot_name = generateRandomName('capture_slot_', used_slots);
        used_slots.add(slot_name);

        intents_for_amazon.push({
          name: intent_name,
          samples: [`{${slot_name}}`],
          slots: [{
            name: slot_name,
            type: slot_name,
          }],
        });

        slot_types.push({
          name: slot_name,
          values: unique_utterances.map((u) => {
            const input_arr = u.split(',').map((e) => e.trim());
            return {
              name: {
                value: input_arr[0],
                synonyms: input_arr.length > 1 ? input_arr.slice(1) : undefined,
              },
            };
          }),
        });
      }
    } else if (slot.startsWith('CAPTURE:')) {
      // check it there is a {capture} only slot for this slot type
      let slot_type = slot.substring(8);
      slot_type = getSlotType({
        name: slot_type,
        type: {
          value: slot_type,
        },
      }, 'alexa');
      if (!capture_intents.has(slot_type)) {
        if (!slot_type.startsWith('AMAZON.')) {
          return;
        }
        // create an intent just for this slot :(
        const intent_name = generateRandomName('capture_intent_', entered_intents);
        entered_intents.add(intent_name);

        const slot_name = generateRandomName('capture_slot_', used_slots);
        capture_intents.add(slot_type);

        intents_for_amazon.push({
          name: intent_name,
          samples: [`{${slot_name}}`],
          slots: [{
            name: slot_name,
            type: slot_type,
          }],
        });
      }
    }
  });

  // this removes the examples for locale default intents, they were there to match choice blocks
  LOCALE_DEFAULTS.defaults.forEach((intent) => {
    intent.samples = intent.samples.filter((s) => !LOCALE_DEFAULT_SET[intent.name].has(s));
    if (intent.keep) {
      // amazon is retarded "Interaction model is not valid. MissingSampleUtterance: Missing sample utterance. At least one sample utterance is required."
      // right now all the yes intents will have at least a "yes" as a sample
      intent.samples = [...intent.samples, ...intent.keep];
      delete intent.keep;
    }
    if (intent.samples.length === 0) delete intent.samples;
  });

  LOCALE_DEFAULTS.built_ins.forEach((intent) => {
    // if this built in intent actually got used, give it the same treatment as the default ones
    if (entered_intents.has(intent.name)) {
      intent.samples = intent.samples.filter((s) => !LOCALE_DEFAULT_SET[intent.name].has(s));
      if (intent.samples.length === 0) delete intent.samples;
    }
  });

  // Check if there are no custom intents
  const customIntents = intents_for_amazon.filter((intent) => !intent.name.startsWith('AMAZON.'));
  if (customIntents && customIntents.length === 0) {
    intents_for_amazon.push(CATCH_ALL_INTENT);
  }

  const interaction_model = {
    interactionModel: {
      languageModel: {
        invocationName: invocation.toLowerCase(),
        intents: intents_for_amazon,
      },
    },
  };

  if (slot_types.length !== 0) {
    interaction_model.interactionModel.languageModel.types = slot_types;
  }

  // console.log("PERFORMANCE END. ms:", Date.now() - time)
  // pass the samples back to do the secondary pass because I REALLY want garbage collection to destroy this shitty function
  return {
    model: interaction_model,
    samples,
  };
};
