import { BUILT_IN_SLOTS as ALEXA_BUILT_IN_SLOTS } from '@voiceflow/alexa-types';
import { BuiltinSlot, CustomSlot, READABLE_VARIABLE_REGEXP, SLOT_REGEXP } from '@voiceflow/common';
import { BUILT_IN_SLOTS as GOOGLE_BUILT_IN_SLOTS } from '@voiceflow/google-types';
import _ from 'lodash';

import { CUSTOM_SLOT_TYPE, PlatformType } from '@/constants';
import { GENERAL_SLOT_TYPES } from '@/constants/platforms';
import { Intent, Slot } from '@/models';

export const getSlotTypes = <L extends string>({
  locales,
  platform,
}: {
  locales: L[];
  platform: PlatformType;
}): { label: string; value: string }[] => {
  let builtInSlots: BuiltinSlot<string, string | L>[];

  switch (platform) {
    case PlatformType.GOOGLE:
      builtInSlots = [...GOOGLE_BUILT_IN_SLOTS];
      break;
    case PlatformType.ALEXA:
      builtInSlots = [...ALEXA_BUILT_IN_SLOTS];
      break;
    default:
      builtInSlots = [...GENERAL_SLOT_TYPES];
  }

  builtInSlots = builtInSlots
    .filter((slot) => !slot.locales || locales.every((locale) => slot.locales!.includes(locale)))
    .sort((lSlot, rSlot) => lSlot.label.localeCompare(rSlot.label));

  builtInSlots = [CustomSlot, ...builtInSlots];

  return builtInSlots.map((slot) => ({ label: slot.label, value: slot.type }));
};

export const transformVariablesToReadable = (text?: string) => text?.replace(SLOT_REGEXP, '{$1}').trim() || '';
export const transformVariablesFromReadableWithoutTrim = (text = '') => text.replace(READABLE_VARIABLE_REGEXP, '{{[$1].$1}}');
export const transformVariablesFromReadable = (text: string) => transformVariablesFromReadableWithoutTrim(text).trim();

export const isVariable = (text?: string | null) => !!(text && text.match(READABLE_VARIABLE_REGEXP));

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
    return 'Slot must have a name';
  }

  if (slotName.length > 32) {
    return 'Slot name cannot exceed 32 characters';
  }

  if (!slotType) {
    return 'Slot must have a type';
  }

  if (slotType === CUSTOM_SLOT_TYPE && !notEmptyValues) {
    return 'Custom slot needs at least one value';
  }

  const lowerCasedSlotName = slotName.toLowerCase();

  if (slots.some(({ name }) => name.toLowerCase() === lowerCasedSlotName)) {
    return `The '${slotName}' slot already exists.`;
  }

  if (intents.some(({ name }) => name.toLowerCase() === lowerCasedSlotName)) {
    return `You have an intent defined with the '${slotName}' name already. Intern/slot name must be unique.`;
  }

  return null;
};
