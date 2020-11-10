import { Locale } from '@voiceflow/alexa-types';
import { constants } from '@voiceflow/common';
import _ from 'lodash';

import { PlatformType, SLOT_REGEXP, SLOT_TYPES, VARIABLE_STRING_REGEXP } from '@/constants';
import { GOOGLE_SLOT_TYPES } from '@/constants/platforms';
import { Nullable } from '@/types';

export const getSlotTypes = ({
  locales,
  platform,
}: {
  locales: Locale[];
  platform: PlatformType;
  publishInfo: Nullable<Record<PlatformType, any>>;
}) => {
  const customSlotType = SLOT_TYPES[0];

  if (platform === PlatformType.GOOGLE) {
    return [{ value: customSlotType.label, label: customSlotType.label }, ...GOOGLE_SLOT_TYPES];
  }

  let slots: constants.Slot[] = [];

  // eslint-disable-next-line no-restricted-syntax
  Object.values(SLOT_TYPES).forEach((slot) => {
    if (!slot.type[platform]) return;

    const slotLocales = slot.locales[platform] || [];

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
