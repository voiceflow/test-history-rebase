import { Utils } from '@voiceflow/common';
import { createSelector } from 'reselect';

import * as Feature from '@/ducks/feature';
import { platformSelector } from '@/ducks/projectV2/selectors/active';
import { getSlotTypes } from '@/utils/slot';

import { localesSelector } from './base';

export const slotTypesSelector = createSelector([localesSelector, platformSelector, Feature.isFeatureEnabledSelector], (locales, platform) =>
  getSlotTypes({ locales, platform })
);

export const slotTypesMapSelector = createSelector([slotTypesSelector], (slotTypes) =>
  Utils.array.createMap(slotTypes, (slotType) => slotType.value)
);
