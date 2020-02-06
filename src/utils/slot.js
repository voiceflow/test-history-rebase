import _ from 'lodash';

import { PlatformType, SLOT_REGEXP, SLOT_TYPES } from '@/constants';

// eslint-disable-next-line import/prefer-default-export
export const getSlotTypes = (locales, platform, publishInfo, filter) => {
  let slots = [SLOT_TYPES[0]]; // Custom Slot

  // eslint-disable-next-line no-restricted-syntax
  for (const slot of Object.values(SLOT_TYPES)) {
    // eslint-disable-next-line no-continue
    if (filter && filter === slot.label) continue;
    // eslint-disable-next-line no-continue
    if (!slot.type[platform]) continue;

    const slotLocales = slot.locales[platform];

    switch (platform) {
      case PlatformType.GOOGLE:
        // eslint-disable-next-line no-case-declarations
        const googleInfo = publishInfo.google;
        if (!(googleInfo && googleInfo.main_locale && !slotLocales.includes(googleInfo.main_locale))) {
          slots.push(slot);
        }
        break;
      case PlatformType.ALEXA:
        if (!slotLocales || (locales && _.intersection(slotLocales, locales).length === locales.length)) {
          slots.push(slot);
        }
        break;
      default:
        break;
    }
  }

  slots = slots.slice(0, 1).concat(
    slots.slice(1).sort((lhs, rhs) => {
      if (lhs.type.google && lhs.type.alexa && !(rhs.type.google && rhs.type.alexa)) {
        return -1;
      }
      if (rhs.type.google && rhs.type.alexa && !(lhs.type.google && lhs.type.alexa)) {
        return 1;
      }
      return lhs.label.localeCompare(rhs.label);
    })
  );

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

export const transformVariables = (text) => text.replace(SLOT_REGEXP, '{$1}').trim();
