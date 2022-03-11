import { createSelector } from 'reselect';

import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

export const {
  all: allSlotsSelector,
  map: slotMapSelector,
  byID: slotByIDSelector,
  byIDs: slotsByIDsSelector,
  allIDs: allSlotIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const getSlotByIDSelector = createCurriedSelector(slotByIDSelector);

export const slotNamesSelector = createSelector([allSlotsSelector], (slots) => slots.map(({ name }) => name));
