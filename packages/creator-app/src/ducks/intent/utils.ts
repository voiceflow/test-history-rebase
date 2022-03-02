import { Adapters } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _isPlainObject from 'lodash/isPlainObject';
import { Normalized } from 'normal-store';

import { applyCustomizableBuiltInIntent, getIntentNameLabel, isCustomizableBuiltInIntent } from '@/utils/intent';
import { createAdvancedPlatformSelector } from '@/utils/platform';

export const getUniqSlots = (inputs: Realtime.IntentInput[]): string[] => [...new Set(inputs.flatMap(({ slots }) => slots || []))];

const newChatSlotsCreator = (id: string): Realtime.ChatIntentSlot => Adapters.Intent.chatIntentSlotSanitizer({ id });
const newVoiceSlotsCreator = (id: string): Realtime.VoiceIntentSlot => Adapters.Intent.voiceIntentSlotSanitizer({ id });

export const getPlatformNewSlotsCreator = createAdvancedPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.CHATBOT]: newChatSlotsCreator,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: newChatSlotsCreator,
  },
  newVoiceSlotsCreator
);

export const intentProcessor = (platform: VoiceflowConstants.PlatformType, { inputs = [], slots, ...intent }: Realtime.Intent): Realtime.Intent => {
  let nextSlots = slots;

  if (!_isPlainObject(slots)) {
    const allKeys = getUniqSlots(inputs);
    const byKey = allKeys.reduce<Record<string, Realtime.ChatIntentSlot> | Record<string, Realtime.VoiceIntentSlot>>(
      (obj, id) => Object.assign(obj, { [id]: getPlatformNewSlotsCreator(platform)(id) }),
      {}
    );

    nextSlots = { byKey, allKeys } as Normalized<Realtime.ChatIntentSlot> | Normalized<Realtime.VoiceIntentSlot>;
  }

  return {
    ...intent,
    slots: nextSlots,
    inputs,
  } as Realtime.Intent;
};

export const applySingleIntentNameFormatting = (platform: VoiceflowConstants.PlatformType, intent: Realtime.Intent): Realtime.Intent => {
  let { name } = intent ?? { name: '' };

  name = getIntentNameLabel(name);
  if (isCustomizableBuiltInIntent(intent)) {
    name = applyCustomizableBuiltInIntent(name, platform);
  }

  return {
    ...intent,
    name,
  };
};

export const applyIntentNameFormatting = (platform: VoiceflowConstants.PlatformType, intents: Realtime.Intent[]): Realtime.Intent[] =>
  intents.map((intent) => applySingleIntentNameFormatting(platform, intent));
