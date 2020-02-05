import _ from 'lodash';
import { createSelector } from 'reselect';

import { activePlatformSelector } from '@/ducks/skill/skill/selectors';
import { createCRUDSelectors } from '@/ducks/utils/crud';
import { BUILT_IN_INTENTS } from '@/utils/intent';

import { STATE_KEY } from './constants';

export const {
  root: rootIntentsSelector,
  map: mapIntentsSelector,
  all: allIntentsSelector,
  byID: intentByIDSelector,
  findByIDs: intentsByIDsSelector,
  has: hasIntentsSelector,
} = createCRUDSelectors(STATE_KEY);

export const allIntentIDsSelector = createSelector(
  allIntentsSelector,
  (intents) => intents.map(({ id }) => id)
);

export const allSlotsByIntentIDSelector = createSelector(
  intentByIDSelector,
  (getIntentByID) => (id) => {
    const intent = getIntentByID(id);

    if (!intent) {
      return [];
    }

    return _.uniq(intent.inputs.flatMap(({ slots }) => slots));
  }
);

export const allPlatformIntentsSelector = createSelector(
  allIntentsSelector,
  activePlatformSelector,
  (intents, platform) => intents.concat(BUILT_IN_INTENTS[platform] || [])
);

export const mapPlatformIntentsSelector = createSelector(
  allPlatformIntentsSelector,
  (intents) =>
    intents.reduce((acc, intent) => {
      acc[intent.id] = intent;
      return acc;
    }, {})
);

export const platformIntentByIDSelector = createSelector(
  mapPlatformIntentsSelector,
  (intentsMap) => (id) => intentsMap[id]
);

export const allSlotsIDsByIntentIDsSelector = createSelector(
  allSlotsByIntentIDSelector,
  (getSlotIDsByIntentID) => (intentIDs) =>
    Array.from(
      intentIDs.reduce((acc, intentID) => {
        getSlotIDsByIntentID(intentID).forEach((slotID) => acc.add(slotID));

        return acc;
      }, new Set())
    )
);

export const intentSlotByIntentIDSlotIDSelector = createSelector(
  intentByIDSelector,
  (getIntentByID) => (intentID, slotID) => {
    const intent = getIntentByID(intentID);

    return intent.slots.byKey[slotID];
  }
);
