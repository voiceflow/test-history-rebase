import { createSelector } from 'reselect';

import * as Feature from '@/ducks/feature';
import * as SlotV1 from '@/ducks/slot';
import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors, idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

const {
  all: _allSlotsSelector,
  allIDs: _allSlotIDsSelector,
  map: _slotMapSelector,
  byID: _slotByIDSelector,
  byIDs: _slotsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const allSlotsSelector = Feature.createAtomicActionsSelector([SlotV1.allSlotsSelector, _allSlotsSelector]);

export const allSlotIDsSelector = Feature.createAtomicActionsSelector([SlotV1.allSlotIDsSelector, _allSlotIDsSelector]);

export const slotMapSelector = Feature.createAtomicActionsSelector([SlotV1.mapSlotsSelector, _slotMapSelector]);

export const slotByIDSelector = Feature.createAtomicActionsSelector(
  [SlotV1.slotByIDSelector, _slotByIDSelector, idParamSelector],
  (getSlotV1, slotV2, slotID) => [slotID ? getSlotV1(slotID) : null, slotV2]
);

export const getSlotByIDSelector = createCurriedSelector(slotByIDSelector);

export const slotsByIDsSelector = Feature.createAtomicActionsSelector(
  [SlotV1.findSlotsByIDsSelector, _slotsByIDsSelector, idsParamSelector],
  (getSlotsV1, slotsV2, slotIDs) => [getSlotsV1(slotIDs), slotsV2]
);

export const slotNamesSelector = createSelector([allSlotsSelector], (slots) => slots.map(({ name }) => name));
