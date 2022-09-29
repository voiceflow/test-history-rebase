import { AlexaConstants } from '@voiceflow/alexa-types';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import type { AnyLocale } from '@/platforms';

import { toVoiceflowLocale, voiceflowLocaleToVoiceflowLang } from './locale';

export const {
  getSlotTypes,
  transformVariablesFromReadable,
  transformVariablesToReadable,
  transformVariablesFromReadableWithoutTrim,
  transformVariableToString,
  isVariable,
  slotToString,
  validateSlotName,
  CUSTOM_ENTITY_VALUE_ERROR_MSG,
} = Realtime.Utils.slot;

export const applySlotNameFormatting = (name = ''): string =>
  name
    .replace(/ /g, '_')
    .replace(/[^A-Z_a-z]/g, '')
    .toLowerCase();

export const toVoiceflowSlotType = (type: string, platform: VoiceflowConstants.PlatformType): VoiceflowConstants.SlotType | undefined => {
  switch (platform) {
    case VoiceflowConstants.PlatformType.ALEXA:
      return AlexaConstants.AmazonToVoiceflowSlotMap[type as AlexaConstants.SlotType] ?? VoiceflowConstants.SlotType.CUSTOM;

    case VoiceflowConstants.PlatformType.GOOGLE:
      return GoogleConstants.GOOGLE_TO_VOICEFLOW_SLOT_TYPE_MAP[type as GoogleConstants.SlotType];

    case VoiceflowConstants.PlatformType.DIALOGFLOW_ES:
      return DFESConstants.DIALOGFLOW_TO_VOICEFLOW_SLOT_TYPE_MAP[type as DFESConstants.SlotType];

    default:
      return type as VoiceflowConstants.SlotType;
  }
};

export const getBuiltInSynonyms = (type: string, locale: AnyLocale, platform: VoiceflowConstants.PlatformType): string[] => {
  const voiceflowSlotType = toVoiceflowSlotType(type, platform);
  const voiceflowLocale = toVoiceflowLocale(locale, platform);

  if (!voiceflowSlotType) return [];

  const slotType = VoiceflowConstants.SlotTypes[voiceflowLocaleToVoiceflowLang(voiceflowLocale)]?.find((slot) => slot.name === voiceflowSlotType);

  return slotType ? [slotType.label, ...slotType.values] : [];
};
