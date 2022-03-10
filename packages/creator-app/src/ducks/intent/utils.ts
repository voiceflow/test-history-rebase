import { Adapters } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _isPlainObject from 'lodash/isPlainObject';
import { Normalized } from 'normal-store';

import { applyCustomizableBuiltInIntent, getIntentNameLabel, isCustomizableBuiltInIntent } from '@/utils/intent';

export const getUniqSlots = (inputs: Realtime.IntentInput[]): string[] => [...new Set(inputs.flatMap(({ slots }) => slots || []))];

type SlotsCreator = (id: string) => Realtime.VoiceIntentSlot | Realtime.ChatIntentSlot;
const newChatSlotsCreator: SlotsCreator = (id) => Adapters.Intent.chatIntentSlotSanitizer({ id });
const newVoiceSlotsCreator: SlotsCreator = (id): Realtime.VoiceIntentSlot => Adapters.Intent.voiceIntentSlotSanitizer({ id });

export const getProjectTypeNewSlotsCreator = Realtime.Utils.platform.createProjectTypeSelectorV2({
  [VoiceflowConstants.ProjectType.CHAT]: newChatSlotsCreator,
  [VoiceflowConstants.ProjectType.VOICE]: newVoiceSlotsCreator,
});

export const intentProcessor = (projectType: VoiceflowConstants.ProjectType, { inputs = [], slots, ...intent }: Realtime.Intent): Realtime.Intent => {
  let nextSlots = slots;

  if (!_isPlainObject(slots)) {
    const allKeys = getUniqSlots(inputs);
    const byKey = allKeys.reduce<Record<string, Realtime.ChatIntentSlot> | Record<string, Realtime.VoiceIntentSlot>>(
      (obj, id) => Object.assign(obj, { [id]: getProjectTypeNewSlotsCreator(projectType)(id) }),
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
