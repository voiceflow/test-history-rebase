import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';

import { addNormalizedByKey, getNormalizedByKey } from '@/utils/normalized';

import { createAction } from './utils';
import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'viewport';
// TODO: expire at some point? 30 days?
const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
};

// actions

export const REHYDRATE_VIEWPORT = 'VIEWPORT:REHYDRATE';

// reducers

export const rehydrateViewportReducer = (state, { payload: { diagramID, viewport } }) => {
  const currentViewport = getNormalizedByKey(state, diagramID);

  if (currentViewport) {
    return state;
  }

  return addNormalizedByKey(state, diagramID, viewport);
};

const viewportCRUDReducer = createCRUDReducer(STATE_KEY);

const viewportReducer = (state, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case REHYDRATE_VIEWPORT:
      return rehydrateViewportReducer(state, action);
    default:
      return viewportCRUDReducer(state, action);
  }
};

export default persistReducer(PERSIST_CONFIG, viewportReducer);

// selectors

export const { root: rootViewportSelector, all: allViewportsSelector, byID: viewportByIDSelector, has: hasViewportSelector } = createCRUDSelectors(
  STATE_KEY
);

// action creators

export const { update: updateViewportForDiagram } = createCRUDActionCreators(STATE_KEY);

export const rehydrateViewport = (diagramID, viewport) => createAction(REHYDRATE_VIEWPORT, { diagramID, viewport });
