/* eslint-disable no-param-reassign */
import { SLOT_REGEXP } from '@voiceflow/common';

import { Transform } from './types';

/**
 * this migration sanitizes the intents to remove all slots that no longer exist
 * deleting an entity now removes all intent references, but this was previously not the case
 * for a given utterance (input.text): 'I am {{[number].z1ap3a1r}} years old' if 'z1ap3a1r' DNE,
 * update this utterance to 'I am number years old', and remove 'z1ap3a1r' from 'intent.slots'
 */
const migrateToV2_3: Transform = ({ version }) => {
  const slotIDs = new Set<string>(version.platformData.slots.map((slot) => slot.key));

  const { platformData } = version;
  platformData.intents.forEach((intent) => {
    intent.inputs.forEach((input) => {
      input.text = input.text.replace(SLOT_REGEXP, (match, name, entityID) => {
        if (!slotIDs.has(entityID)) {
          return name;
        }
        return match;
      });
    });

    if (intent.slots) {
      intent.slots = intent.slots.filter((intentSlot) => slotIDs.has(intentSlot.id));
    }
  });
};

export default migrateToV2_3;
