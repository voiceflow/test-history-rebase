import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils as CommonUtils } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { voiceflowLocaleToVoiceflowLang } from './locale';

export const {
  getSlotTypes,
  transformVariablesFromReadable,
  transformVariablesToReadable,
  transformVariablesFromReadableWithoutTrim,
  transformVariableToString,
  isVariable,
  slotToString,
  validateSlotName,
} = Realtime.Utils.slot;

// even more restrictive subset (no numbers allowed, lowercase only)
export const platformSlotFormatter = (name = '') =>
  name
    .replace(/ /g, '_')
    .replace(/[^A-Z_a-z]/g, '')
    .toLowerCase();

// ensure valid javascript variable format
export const defaultSlotFormatter = (name = '') =>
  name
    .replace(/ /g, '_')
    .replace(/[^\w$]/g, '')
    .replace(/^\d/, ''); // first character cannot be a number

export const applySlotNameFormatting = Utils.platform.createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: platformSlotFormatter,
  },
  defaultSlotFormatter
);

export const slotNameFormatter = Utils.platform.createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: CommonUtils.string.removeTrailingUnderscores,
  },
  (name: string) => name
);

export const toVoiceflowSlotType = (type: string, platform: Platform.Constants.PlatformType): VoiceflowConstants.SlotType | undefined => {
  switch (platform) {
    case Platform.Constants.PlatformType.ALEXA:
      return AlexaConstants.AmazonToVoiceflowSlotMap[type as AlexaConstants.SlotType] ?? VoiceflowConstants.SlotType.CUSTOM;

    case Platform.Constants.PlatformType.GOOGLE:
      return GoogleConstants.GOOGLE_TO_VOICEFLOW_SLOT_TYPE_MAP[type as GoogleConstants.SlotType];

    case Platform.Constants.PlatformType.DIALOGFLOW_ES:
      return DFESConstants.DIALOGFLOW_TO_VOICEFLOW_SLOT_TYPE_MAP[type as DFESConstants.SlotType];

    default:
      return type as VoiceflowConstants.SlotType;
  }
};

export const getBuiltInSynonyms = (type: string, locale: VoiceflowConstants.Locale, platform: Platform.Constants.PlatformType): string[] => {
  const voiceflowSlotType = toVoiceflowSlotType(type, platform);

  if (!voiceflowSlotType) return [];

  const slotType = VoiceflowConstants.SlotTypes[voiceflowLocaleToVoiceflowLang(locale)]?.find((slot) => slot.name === voiceflowSlotType);

  return slotType ? [slotType.label, ...slotType.values] : [];
};

export const isDefaultSlotName = (name?: string | null) => !name || name.toLowerCase().startsWith('entity');

export const generateSlotInput = (value = '', synonyms = ''): Realtime.SlotInput => ({
  id: CommonUtils.id.cuid.slug(),
  value,
  synonyms,
});

export const mergeSlotInputs = (inputs1: Realtime.SlotInput[], inputs2: Realtime.SlotInput[]): Realtime.SlotInput[] => {
  const mergeMap = new Map<string, { id: string; value: string; synonyms: string[] }>();

  [...inputs1, ...inputs2].forEach((input) => {
    const mergeInput = mergeMap.get(input.value);
    const synonyms = input.synonyms
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (mergeInput) {
      mergeMap.set(input.value, {
        ...mergeInput,
        synonyms: [...new Set([...mergeInput.synonyms, ...synonyms])],
      });
    } else {
      mergeMap.set(input.value, {
        id: input.id,
        value: input.value,
        synonyms: [...new Set(synonyms)],
      });
    }
  });

  return [...mergeMap.values()].map((mergeInput) => ({
    ...mergeInput,
    synonyms: mergeInput.synonyms.join(', '),
  }));
};
