import { Intent, Slot } from '@voiceflow/api-sdk';

import client from '@/client';
import * as Skill from '@/ducks/skill';
import { Thunk } from '@/store/types';

// i.e. AMAZON.ShuffleOffIntent
const PREBUILT_INTENT_REGEX = /^[A-Z]+\..+$/;
const VOICEFLOW_PREBUILT_PREFIX = 'VF.';

export interface Validation {
  invalid: {
    slots: Slot[];
    intents: Intent[];
  };
}

// validate if the model will have unexpected side effects during training
const validateModel = (): Thunk<Validation> => async (_, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);

  const prototype = await client.api.version.getPrototype(versionID);
  if (!prototype) throw new Error('version prototype not found');

  const { slots, intents } = prototype.model;

  // determine if there are slots with no values
  const invalidSlots = slots.filter((slot) => !slot.inputs.length && !slot.type.value?.startsWith(VOICEFLOW_PREBUILT_PREFIX));

  const invalidIntents = intents.filter(
    ({ key, inputs }) => !inputs.length || (PREBUILT_INTENT_REGEX.test(key) && !key.startsWith(VOICEFLOW_PREBUILT_PREFIX))
  );

  return {
    invalid: { slots: invalidSlots, intents: invalidIntents },
  };
};

export default validateModel;
