import { constants, utils } from '@voiceflow/common';
import NLC, { IIntentSlot } from '@voiceflow/natural-language-commander';

import { spreadSynonyms } from '@/client/adapters/slot';
import { DBIntent, DBSlot } from '@/models';

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
      console.error('NLC Unable To Register Slot:', slot, err);
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
            dialog = {
              prompt: getUtterancesWithSlotNames(intentSlot.dialog.prompt, slots),
              confirm: getUtterancesWithSlotNames(intentSlot.dialog.confirm, slots),
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
      console.error('NLC Unable To Register Custom Intent:', intent, err);
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
        console.error('NLC Unable To Register Built In Intent:', intent, err);
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
        console.error('NLC Unable To Register Audio Intent:', intent, err);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

export const createAndRegister = ({ slots, intents, language, builtInIntentsFilter }: Options): NLC => {
  const nlc = new NLC();

  registerSlots(nlc, slots);

  registerCustomIntents(nlc, { slots, intents });

  registerBuiltInIntents(nlc, { language, builtInIntentsFilter });

  return nlc;
};
