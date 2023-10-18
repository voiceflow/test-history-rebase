import { createSelector } from 'reselect';

import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  all: allSlotsSelector,
  map: slotMapSelector,
  byID: slotByIDSelector,
  byIDs: slotsByIDsSelector,
  allIDs: allSlotIDsSelector,
  getByID: getSlotByIDSelector,
  withoutIDs: slotsWithoutIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const slotNameMapSelector = createSelector([allSlotsSelector], (slots) => Object.fromEntries(slots.map((slot) => [slot.name, slot])));
export const allSlotsOrderedByNameSelector = createSelector([allSlotsSelector], (slots) => slots.sort((a, b) => a.name.localeCompare(b.name)));
