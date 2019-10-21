import _ from 'lodash';
import { createSelector } from 'reselect';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'intent';

const intentReducer = createCRUDReducer(STATE_KEY);

export default intentReducer;

// selectors

export const {
  root: rootIntentsSelector,
  all: allIntentsSelector,
  byID: intentByIDSelector,
  findByIDs: intentsByIDsSelector,
  has: hasIntentsSelector,
} = createCRUDSelectors(STATE_KEY);

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

// action creators

export const { add: addIntent, addMany: addIntents, update: updateIntent, remove: removeIntent, replace: replaceIntents } = createCRUDActionCreators(
  STATE_KEY
);
