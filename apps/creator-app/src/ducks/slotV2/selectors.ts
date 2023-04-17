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

export const slotNamesSelector = createSelector([allSlotsSelector], (slots) => slots.map(({ name }) => name));
export const slotNameMapSelector = createSelector([allSlotsSelector], (slots) => Object.fromEntries(slots.map((slot) => [slot.name, slot])));

export const slotByNameSelector = createSelector(
  [allSlotsSelector],
  (slots) => (targetName: string) => slots.find(({ name }) => targetName === name)
);
