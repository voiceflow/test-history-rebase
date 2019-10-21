import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'slot';

const slotReducer = createCRUDReducer(STATE_KEY);

export default slotReducer;

// selectors

export const {
  root: rootSlotsSelector,
  all: allSlotsSelector,
  findByIDs: findSlotsByIDsSelector,
  byID: slotByIDSelector,
  has: hasSlotsSelector,
} = createCRUDSelectors(STATE_KEY);

// action creators

export const { add: addSlot, addMany: addSlots, update: updateSlot, remove: removeSlot, replace: replaceSlots } = createCRUDActionCreators(STATE_KEY);
