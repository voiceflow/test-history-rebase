import { Utils } from '@voiceflow/common';
import { createSelector } from 'reselect';

import { platformSelector } from '@/ducks/projectV2/selectors/active';
import { getSlotTypes } from '@/utils/slot';

import { localesSelector } from './base';

export const entityTypesSelector = createSelector([localesSelector, platformSelector], (locales, platform) => getSlotTypes({ locales, platform }));

export const entityTypesMapSelector = createSelector([entityTypesSelector], (entityTypes) =>
  Utils.array.createMap(entityTypes, (entityType) => entityType.value)
);
