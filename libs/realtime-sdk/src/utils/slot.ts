import { Slot } from '@realtime-sdk/models';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { BuiltinSlot, CustomSlot, READABLE_VARIABLE_REGEXP, SLOT_REGEXP, Utils } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config/backend';
import { Entity } from '@voiceflow/sdk-logux-designer';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const generalSlotTypesByLanguage = (language: string = VoiceflowConstants.Language.EN) =>
  VoiceflowConstants.SlotTypes[language]?.map<BuiltinSlot<VoiceflowConstants.SlotType, never>>((slot) => ({ type: slot.name, label: slot.label })) ||
  [];

const sortSlotsByType =
  (order: string[]) =>
  <L extends string>(lSlot: BuiltinSlot<string, string | L>, rSlot: BuiltinSlot<string, string | L>) => {
    const lIndex = order.indexOf(lSlot.type);
    const rIndex = order.indexOf(rSlot.type);

    return rIndex - lIndex;
  };

export const getSlotTypes = <L extends string>({
  locales,
  platform,
}: {
  locales: L[];
  platform: Platform.Constants.PlatformType;
}): { label: string; value: string }[] => {
  let builtInSlots: BuiltinSlot<string, string | L>[];
  let language: string | undefined;
  switch (platform) {
    case Platform.Constants.PlatformType.GOOGLE:
      builtInSlots = [...GoogleConstants.BUILT_IN_SLOTS].sort(sortSlotsByType([GoogleConstants.SlotType.NUMBER]));
      break;
    case Platform.Constants.PlatformType.DIALOGFLOW_ES:
      builtInSlots = [...DFESConstants.BUILT_IN_SLOTS].sort(sortSlotsByType([DFESConstants.SlotType.NUMBER]));
      break;
    case Platform.Constants.PlatformType.ALEXA:
      builtInSlots = Utils.array
        .inferUnion<BuiltinSlot<string, string | L>[]>([...AlexaConstants.BUILT_IN_SLOTS])
        .filter((slot) => !slot.locales || locales.every((locale) => slot.locales!.includes(locale)))
        .sort((lSlot, rSlot) => lSlot.label.localeCompare(rSlot.label))
        .sort(sortSlotsByType([AlexaConstants.SlotType.NUMBER]));
      break;
    default:
      language = locales[0]?.substring(0, 2);
      // es-MX has different built in entities than es-ES, so needs a seperate case. See VF-159

      if (locales[0] === VoiceflowConstants.Locale.ES_MX) {
        language = VoiceflowConstants.Locale.ES_MX;
      }

      builtInSlots = generalSlotTypesByLanguage(language);

      builtInSlots = builtInSlots
        .filter((slot) => slot.type !== VoiceflowConstants.SlotType.NATOAPCO)
        .sort(sortSlotsByType([VoiceflowConstants.SlotType.NUMBER]));
  }

  builtInSlots = [CustomSlot, ...builtInSlots];

  return builtInSlots.map((slot) => ({ label: slot.label, value: slot.type }));
};

export const transformVariablesToReadable = (text?: string) => text?.replace(SLOT_REGEXP, '{$1}').trim() || '';
export const transformVariableToString = (text?: string) => text?.replace(SLOT_REGEXP, '$1').trim() || '';
export const transformVariablesFromReadableWithoutTrim = (text = '') => text.replace(READABLE_VARIABLE_REGEXP, '{{[$1].$1}}');
export const transformVariablesFromReadable = (text: string) => transformVariablesFromReadableWithoutTrim(text).trim();

export const isVariable = (text?: string | null) => !!(text && text.match(READABLE_VARIABLE_REGEXP));
export const slotToString = <T extends { id: string; name: string }>(slot: T): string => `{{[${slot.name}].${slot.id}}}`;

export const validateSlotName = ({
  slots,
  intents,
  slotName,
  slotType,
}: {
  slots: Array<Slot | Entity>;
  intents: Platform.Base.Models.Intent.Model[];
  slotName: string;
  slotType: string | null;
}) => {
  if (!slotName.trim()) {
    return 'Entity must have a name';
  }

  if (!/[A-Za-z]/.test(slotName)) {
    return 'Entity name must contain at least one letter';
  }

  if (slotName.length > 32) {
    return 'Entity name cannot exceed 32 characters';
  }

  if (!slotType) {
    return 'Entity must have a type';
  }

  const lowerCasedSlotName = slotName.toLowerCase();

  if (slots.some(({ name }) => name.toLowerCase() === lowerCasedSlotName)) {
    return `The '${slotName}' entity already exists.`;
  }

  if (intents.some(({ name }) => name.toLowerCase() === lowerCasedSlotName)) {
    return `You have an intent defined with the '${slotName}' name already. Intent/entity name must be unique.`;
  }

  return null;
};
