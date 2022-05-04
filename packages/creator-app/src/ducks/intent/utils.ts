import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _isPlainObject from 'lodash/isPlainObject';
import { Normalized } from 'normal-store';

import { fmtIntentName } from '@/utils/intent';

export const getUniqSlots = (inputs: Realtime.IntentInput[]): string[] => [...new Set(inputs.flatMap(({ slots }) => slots || []))];

export const intentProcessor = (projectType: VoiceflowConstants.ProjectType, { inputs = [], slots, ...intent }: Realtime.Intent): Realtime.Intent => {
  let nextSlots = slots;

  if (!_isPlainObject(slots)) {
    const allKeys = getUniqSlots(inputs);
    const byKey = allKeys.reduce<Record<string, Realtime.ChatIntentSlot> | Record<string, Realtime.VoiceIntentSlot>>(
      (obj, id) => Object.assign(obj, { [id]: Realtime.Utils.slot.intentSlotFactoryCreator(projectType)({ id }) }),
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
  return {
    ...intent,
    name: fmtIntentName(intent, platform),
  };
};

export const applyIntentNameFormatting = (platform: VoiceflowConstants.PlatformType, intents: Realtime.Intent[]): Realtime.Intent[] =>
  intents.map((intent) => applySingleIntentNameFormatting(platform, intent));
