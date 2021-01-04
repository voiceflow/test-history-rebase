import _uniq from 'lodash/uniq';
import { createSelector } from 'reselect';

import { PlatformType } from '@/constants';
import { activePlatformSelector } from '@/ducks/skill/skill/selectors';
import { createCRUDSelectors } from '@/ducks/utils/crud';
import { Intent } from '@/models';
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

export const allIntentIDsSelector = createSelector([allIntentsSelector], (intents) => intents.map(({ id }) => id));

export const allSlotsByIntentIDSelector = createSelector([intentByIDSelector], (getIntentByID) => (id: string): string[] => {
  const intent = getIntentByID(id);

  return !intent ? [] : _uniq(intent.inputs.flatMap(({ slots }) => slots ?? '')).filter((s) => !!s);
});

export const allPlatformIntentsSelector = createSelector([allIntentsSelector, activePlatformSelector], (intents, platform: PlatformType) =>
  intents.concat(BUILT_IN_INTENTS[platform] || [])
);

export const mapPlatformIntentsSelector = createSelector([allPlatformIntentsSelector], (intents) =>
  intents.reduce<Record<string, Intent>>((acc, intent) => Object.assign(acc, { [intent.id]: intent }), {})
);

export const platformIntentByIDSelector = createSelector([mapPlatformIntentsSelector], (intentsMap) => (id: string) => intentsMap[id]);

export const allSlotsIDsByIntentIDsSelector = createSelector([allSlotsByIntentIDSelector], (getSlotIDsByIntentID) => (intentIDs: string[]) =>
  Array.from(
    intentIDs.reduce<Set<string>>((acc, intentID) => {
      getSlotIDsByIntentID(intentID).forEach((slotID) => acc.add(slotID));

      return acc;
    }, new Set())
  )
);

export const intentSlotByIntentIDSlotIDSelector = createSelector([intentByIDSelector], (getIntentByID) => (intentID: string, slotID: string) => {
  const intent = getIntentByID(intentID);

  return intent.slots.byKey[slotID];
});
