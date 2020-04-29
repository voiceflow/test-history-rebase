import { utils } from '@voiceflow/common';

import { NLCIntent, NLCIntentSlot } from '../../types';

// eslint-disable-next-line import/prefer-default-export
export const getNLCIntentSlotsMap = ({ slots }: NLCIntent) =>
  slots
    ? slots.reduce<Record<string, NLCIntentSlot>>((obj, { name, value }) => {
        const formattedName = utils.intent.formatName(name);

        return Object.assign(obj, { [formattedName]: { name: formattedName, value } });
      }, {})
    : slots;
