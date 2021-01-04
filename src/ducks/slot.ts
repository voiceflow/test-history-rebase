import { createSelector } from 'reselect';

import { allIntentsSelector } from '@/ducks/intent';
import { Slot } from '@/models';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'slot';

const slotReducer = createCRUDReducer<Slot>(STATE_KEY);

export default slotReducer;

// selectors

export const {
  root: rootSlotsSelector,
  all: allSlotsSelector,
  map: mapSlotsSelector,
  findByIDs: findSlotsByIDsSelector,
  byID: slotByIDSelector,
  has: hasSlotsSelector,
} = createCRUDSelectors(STATE_KEY);

// action creators

export const {
  add: addSlot,
  addMany: addSlots,
  update: updateSlot,
  remove: removeSlot,
  replace: replaceSlots,
  reorder: reorderSlots,
} = createCRUDActionCreators(STATE_KEY);

// selectors

export const allSlotIDsSelector = createSelector([allSlotsSelector], (slots) => slots.map(({ id }) => id));

export const intentsUsingSlotSelector = createSelector([allIntentsSelector], (intents) => (slotID: string) =>
  intents.reduce<typeof intents>((acc, intent) => {
    if (intent.slots.allKeys.includes(slotID)) {
      acc.push(intent);
    }

    return acc;
  }, [])
);

export const slotNamesSelector = createSelector([allSlotsSelector], (slots) => slots.map(({ name }) => name));
