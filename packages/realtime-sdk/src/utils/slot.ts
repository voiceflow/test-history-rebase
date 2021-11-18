import { CUSTOM_SLOT_TYPE } from '@realtime-sdk/constants';
import { Intent, Slot } from '@realtime-sdk/models';
import { Constants as AlexaConstants } from '@voiceflow/alexa-types';
import { BuiltinSlot, CustomSlot, READABLE_VARIABLE_REGEXP, SLOT_REGEXP } from '@voiceflow/common';
import { Constants, Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as DialogflowConstants } from '@voiceflow/google-dfes-types';
import { Constants as GoogleConstants } from '@voiceflow/google-types';

export const generalSlotTypesByLanguage = (language: string = GeneralConstants.Language.EN) =>
  GeneralConstants.SlotTypes[language]?.map<BuiltinSlot<GeneralConstants.SlotType, never>>((slot) => ({ type: slot.name, label: slot.label })) || [];

export const getSlotTypes = <L extends string>({
  locales,
  platform,
  natoEnabled,
}: {
  locales: L[];
  platform: Constants.PlatformType;
  natoEnabled: boolean;
}): { label: string; value: string }[] => {
  let builtInSlots: BuiltinSlot<string, string | L>[];
  let language: string | undefined;
  switch (platform) {
    case Constants.PlatformType.GOOGLE:
      builtInSlots = [...GoogleConstants.BUILT_IN_SLOTS];
      break;
    case Constants.PlatformType.DIALOGFLOW_ES_CHAT:
      builtInSlots = [...DialogflowConstants.BUILT_IN_SLOTS];
      break;
    case Constants.PlatformType.DIALOGFLOW_ES_VOICE:
      builtInSlots = [...DialogflowConstants.BUILT_IN_SLOTS];
      break;
    case Constants.PlatformType.ALEXA:
      builtInSlots = [...AlexaConstants.BUILT_IN_SLOTS];
      builtInSlots = builtInSlots
        .filter((slot) => !slot.locales || locales.every((locale) => slot.locales!.includes(locale)))
        .sort((lSlot, rSlot) => lSlot.label.localeCompare(rSlot.label));
      break;
    default:
      language = locales[0]?.substring(0, 2);
      // es-MX has different built in entities than es-ES, so needs a seperate case. See VF-159
      if (locales[0] === Constants.Locale.ES_MX) {
        language = Constants.Locale.ES_MX;
      }
      builtInSlots = generalSlotTypesByLanguage(language);
      if (!natoEnabled) {
        builtInSlots = builtInSlots.filter((slot) => slot.type !== GeneralConstants.SlotType.NATOAPCO);
      }
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
  notEmptyValues,
}: {
  slots: Slot[];
  intents: Intent[];
  slotName: string;
  slotType: string;
  notEmptyValues?: boolean;
}) => {
  if (!slotName.trim()) {
    return 'Entity must have a name';
  }

  if (slotName.length > 32) {
    return 'Entity name cannot exceed 32 characters';
  }

  if (!slotType) {
    return 'Entity must have a type';
  }

  if (slotType === CUSTOM_SLOT_TYPE && !notEmptyValues) {
    return 'Custom entity needs at least one value';
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
