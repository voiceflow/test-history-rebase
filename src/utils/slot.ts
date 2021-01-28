import { constants } from '@voiceflow/common';
import _ from 'lodash';

import { CUSTOM_SLOT_TYPE, PlatformType, SLOT_REGEXP, SLOT_TYPES, VARIABLE_STRING_REGEXP } from '@/constants';
import { GENERAL_SLOT_TYPES, GOOGLE_SLOT_TYPES } from '@/constants/platforms';
import { Intent, Slot } from '@/models';
import { Nullable } from '@/types';

export const getSlotTypes = <L extends string>({
  locales,
  platform,
}: {
  locales: L[];
  platform: PlatformType;
  publishInfo: Nullable<Record<PlatformType, any>>;
}): { value?: string; label: string }[] => {
  const customSlotType = SLOT_TYPES[0];
  const language = locales[0]?.substring(0, 2);

  if (platform === PlatformType.GOOGLE) {
    return [{ value: customSlotType.label, label: customSlotType.label }, ...GOOGLE_SLOT_TYPES];
  }

  if (platform === PlatformType.GENERAL) {
    return [{ value: customSlotType.label, label: customSlotType.label }, ...(GENERAL_SLOT_TYPES[language!] || [])];
  }

  let slots: constants.Slot[] = [];

  // eslint-disable-next-line no-restricted-syntax
  Object.values(SLOT_TYPES).forEach((slot) => {
    if (!slot.type[platform]) return;

    const slotLocales = (slot.locales[platform] || []) as L[];

    if (platform === PlatformType.ALEXA && (!slotLocales || (locales && _.intersection(slotLocales, locales).length === locales.length))) {
      slots.push(slot);
    }
  });

  slots = [
    customSlotType,
    ...slots.sort((lhs, rhs) => {
      if (lhs.type.google && lhs.type.alexa && !(rhs.type.google && rhs.type.alexa)) {
        return -1;
      }
      if (rhs.type.google && rhs.type.alexa && !(lhs.type.google && lhs.type.alexa)) {
        return 1;
      }
      return lhs.label.localeCompare(rhs.label);
    }),
  ];

  return slots.map((type) => {
    let value;
    if ((type.type.alexa && type.type.google) || (!type.type.alexa && !type.type.google)) {
      value = type.label;
    } else if (type.type.alexa && !type.type.google) {
      value = type.type.alexa;
    } else if (!type.type.alexa && type.type.google) {
      value = type.type.google;
    }

    return { label: type.label, value };
  });
};

export const transformVariablesToReadable = (text?: string) => text?.replace(SLOT_REGEXP, '{$1}').trim() || '';
export const transformVariablesFromReadableWithoutTrim = (text = '') => text.replace(VARIABLE_STRING_REGEXP, '{{[$1].$1}}');
export const transformVariablesFromReadable = (text: string) => transformVariablesFromReadableWithoutTrim(text).trim();

export const isVariable = (text?: string | null) => !!(text && text.match(VARIABLE_STRING_REGEXP));

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
