import { utils } from '@voiceflow/common';
import NLC, { IIntentSlot } from '@voiceflow/natural-language-commander';

import { spreadSynonyms } from '@/client/adapters/legacy/slot';
import { DBIntent, DBSlot } from '@/models';
import Logger from '@/utils/logger';

const log = Logger.child('nlc');

type Options = {
  slots: DBSlot[];
  intents: DBIntent[];
  builtInIntents: { name: string; samples: string[] }[];
};

const { getUtterancesWithSlotNames } = utils.intent;

const CUSTOM_SLOT_TYPE = 'Custom';

export const registerSlots = (nlc: NLC, { slots }: Options) => {
  slots.map(spreadSynonyms).forEach((slot) => {
    try {
      if (slot.type?.value === CUSTOM_SLOT_TYPE) {
        nlc.addSlotType({ type: slot.name, matcher: slot.inputs });
      } else {
        nlc.addSlotType({ type: slot.name, matcher: /[\S\s]*/ });
      }
    } catch (err) {
      log.error('NLC Unable To Register Slot', log.value(slot), err);
    }
  });
};

export const registerCustomIntents = (nlc: NLC, { slots, intents }: Options) => {
  intents.forEach((intent) => {
    const samples = getUtterancesWithSlotNames(intent.inputs, slots)
      .map((value) => value.trim())
      .filter(Boolean);

    let intentSlots: IIntentSlot[] = [];
    if (intent.slots) {
      intentSlots = intent.slots.reduce<IIntentSlot[]>((acc, intentSlot) => {
        const slot = slots.find((slot) => slot.key === intentSlot.id);
        if (slot) {
          let dialog;

          if (intentSlot.dialog) {
            let confirm: string[] = [];

            if (intentSlot.dialog.confirmEnabled) {
              confirm = intentSlot.dialog.confirm[0]?.text ? getUtterancesWithSlotNames(intentSlot.dialog.confirm, slots) : [''];
            }

            dialog = {
              prompt: getUtterancesWithSlotNames(intentSlot.dialog.prompt, slots),
              confirm,
              utterances: getUtterancesWithSlotNames(intentSlot.dialog.utterances, slots),
            };
          }
          acc.push({
            name: slot.name,
            type: slot.name,
            dialog,
            required: !!intentSlot.required,
          });
        }
        return acc;
      }, []);
    }

    try {
      nlc.registerIntent({
        slots: intentSlots,
        intent: intent.name,
        utterances: samples,
      });
    } catch (err) {
      log.error('NLC Unable To Register Custom Intent', log.value(intent), err);
    }
  });
};

export const registerBuiltInIntents = (nlc: NLC, { builtInIntents }: Options) => {
  builtInIntents.forEach((intent) => {
    const { name, samples } = intent;

    try {
      nlc.registerIntent({ intent: name, utterances: samples });
    } catch (err) {
      log.error('NLC Unable To Register Built In Intent', log.value(intent), err);
    }
  });
};

export const createAndRegister = (options: Options): NLC => {
  const nlc = new NLC();

  registerSlots(nlc, options);

  registerCustomIntents(nlc, options);

  registerBuiltInIntents(nlc, options);

  return nlc;
};
