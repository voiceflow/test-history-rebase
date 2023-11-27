import { Utils } from '@voiceflow/common';
import { createSelector } from 'reselect';

import { platformSelector } from '@/ducks/projectV2/selectors/active';
import { getSlotTypes } from '@/utils/slot';

import { localesSelector } from './base';

export const entityTypesSelector = createSelector([localesSelector, platformSelector], (locales, platform) => getSlotTypes({ locales, platform }));

export const entityTypesMapSelector = createSelector([entityTypesSelector], (slotTypes) =>
  Utils.array.createMap(slotTypes, (slotType) => slotType.value)
);
