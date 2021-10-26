import { Constants } from '@voiceflow/general-types';
import { Adapters } from '@voiceflow/realtime-sdk';
import _isPlainObject from 'lodash/isPlainObject';

import { ChatIntentSlot, Intent, IntentInput, VoiceIntentSlot } from '@/models';
import { getIntentNameLabel, isCustomizableBuiltInIntent, removeBuiltInPrefix } from '@/utils/intent';
import { Normalized } from '@/utils/normalized';
import { createAdvancedPlatformSelector } from '@/utils/platform';
import { capitalizeFirstLetter } from '@/utils/string';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

export const getUniqSlots = (inputs: IntentInput[]): string[] => [...new Set(inputs.flatMap(({ slots }) => slots || []))];

const newChatSlotsCreator = (id: string): ChatIntentSlot => Adapters.Intent.chatIntentSlotSanitizer({ id });
const newVoiceSlotsCreator = (id: string): VoiceIntentSlot => Adapters.Intent.voiceIntentSlotSanitizer({ id });

export const getPlatformNewSlotsCreator = createAdvancedPlatformSelector(
  {
    [Constants.PlatformType.CHATBOT]: newChatSlotsCreator,
  },
  newVoiceSlotsCreator
);

export const intentProcessor = (platform: Constants.PlatformType, { inputs = [], slots, ...intent }: Intent): Intent => {
  let nextSlots = slots;

  if (!_isPlainObject(slots)) {
    const allKeys = getUniqSlots(inputs);
    const byKey = allKeys.reduce<Record<string, ChatIntentSlot> | Record<string, VoiceIntentSlot>>(
      (obj, id) => Object.assign(obj, { [id]: getPlatformNewSlotsCreator(platform)(id) }),
      {}
    );

    nextSlots = { byKey, allKeys } as Normalized<ChatIntentSlot> | Normalized<VoiceIntentSlot>;
  }

  return {
    ...intent,
    slots: nextSlots,
    inputs,
  } as Intent;
};

export const applySingleIntentNameFormatting = (platform: Constants.PlatformType, intent: Intent): Intent => {
  let { name } = intent ?? { name: '' };

  name = getIntentNameLabel(name);

  if (isCustomizableBuiltInIntent(intent)) {
    name = removeBuiltInPrefix(name);

    if (isAnyGeneralPlatform(platform)) {
      name = capitalizeFirstLetter(name?.toLowerCase());
    } else if (platform === Constants.PlatformType.ALEXA) {
      name = name.replace(/(\w)Intent/g, '$1');
    }
  }

  return {
    ...intent,
    name,
  };
};

export const applyIntentNameFormatting = (platform: Constants.PlatformType, intents: Intent[]): Intent[] =>
  intents.map((intent) => applySingleIntentNameFormatting(platform, intent));
