import { constants, utils } from '@voiceflow/common';
import NLC, { IIntentSlot } from '@voiceflow/natural-language-commander';

import { spreadSynonyms } from '@/client/adapters/slot';
import { DBIntent, DBSlot } from '@/models';
import Logger from '@/utils/logger';

const log = Logger.child('nlc');

type BuiltInIntentsFilter = (name: string) => boolean;

type Options = {
  slots: DBSlot[];
  intents: DBIntent[];
  language: string;
  builtInIntentsFilter?: BuiltInIntentsFilter;
};

const { getUtterancesWithSlotNames } = utils.intent;

const {
  intents: { DEFAULT_INTENTS },
} = constants;

const CUSTOM_SLOT_TYPE = 'Custom';

const AUDIO_INTENTS = [
  {
    name: 'Pause',
    intent: 'AMAZON.PauseIntent',
  },
  {
    name: 'Resume',
    intent: 'AMAZON.ResumeIntent',
  },
  {
    name: 'Next',
    intent: 'AMAZON.NextIntent',
  },
  {
    name: 'Previous',
    intent: 'AMAZON.PreviousIntent',
  },
];

export const registerSlots = (nlc: NLC, slots: DBSlot[]) => {
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

export const registerCustomIntents = (nlc: NLC, { slots, intents }: Pick<Options, 'slots' | 'intents'>) => {
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

export const registerBuiltInIntents = (nlc: NLC, { language, builtInIntentsFilter }: Pick<Options, 'language' | 'builtInIntentsFilter'>) => {
  try {
    const builtInIntents = DEFAULT_INTENTS[language.slice(0, 2)].defaults;

    builtInIntents.forEach((intent) => {
      const { samples, name } = intent;

      if (builtInIntentsFilter && builtInIntentsFilter(name) === false) {
        return;
      }

      try {
        nlc.registerIntent({
          intent: name,
          utterances: samples,
        });
      } catch (err) {
        log.error('NLC Unable To Register Built In Intent', log.value(intent), err);
      }
    });

    AUDIO_INTENTS.forEach(({ intent, name }) => {
      if (builtInIntentsFilter && builtInIntentsFilter(name) === false) {
        return;
      }

      try {
        nlc.registerIntent({
          intent,
          utterances: [name],
        });
      } catch (err) {
        log.error('NLC Unable To Register Audio Intent', log.value(intent), err);
      }
    });
  } catch (err) {
    log.error(err);
  }
};

export const createAndRegister = ({ slots, intents, language, builtInIntentsFilter }: Options): NLC => {
  const nlc = new NLC();

  registerSlots(nlc, slots);

  registerCustomIntents(nlc, { slots, intents });

  registerBuiltInIntents(nlc, { language, builtInIntentsFilter });

  return nlc;
};
