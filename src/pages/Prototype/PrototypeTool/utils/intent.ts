import { utils } from '@voiceflow/common';

import { Choice } from '@/ducks/prototype';

import { NLCIntent, NLCIntentSlot } from '../../types';

// eslint-disable-next-line import/prefer-default-export
export const getNLCIntentSlotsMap = ({ slots }: NLCIntent) =>
  slots
    ? slots.reduce<Record<string, NLCIntentSlot>>((obj, { name, value }) => {
        const formattedName = utils.intent.formatName(name);

        return Object.assign(obj, { [formattedName]: { name: formattedName, value } });
      }, {})
    : slots;

export const getUtteranceChoices = (choices: Choice[], intents: { intent: string; utterances: string[] }[]) => {
  return choices.map((choice) => {
    const intent = intents.find(({ intent: name }: { intent: string }) => name === choice.name);

    const noSlotUtterances = intent?.utterances?.filter((utterance: string) => !utterance.match(/{\w{1,32}}/g));
    if (noSlotUtterances?.length) {
      return { name: noSlotUtterances[0] };
    }

    return choice;
  });
};
