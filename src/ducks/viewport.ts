import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { Action, Reducer, RootReducer } from '@/store/types';
import { Viewport } from '@/types';
import { Normalized, addNormalizedByKey, getNormalizedByKey } from '@/utils/normalized';

import { createAction } from './utils';
import createCRUDReducer, { AnyCRUDAction, INITIAL_STATE as INITIAL_CRUD_STATE, createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'viewport';
const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
};

export type ViewportModel = Viewport & { diagramID: string };

// actions

export enum ViewportAction {
  REHYDRATE_VIEWPORT = 'VIEWPORT:REHYDRATE',
}

export type RehydrateViewport = Action<ViewportAction.REHYDRATE_VIEWPORT, { diagramID: string; viewport: Viewport }>;

type AnyViewportAction = AnyCRUDAction<ViewportModel> | RehydrateViewport;

// reducers

export const rehydrateViewportReducer: Reducer<Normalized<ViewportModel>, RehydrateViewport> = (state, { payload: { diagramID, viewport } }) => {
  const currentViewport = getNormalizedByKey(state, diagramID);

  if (currentViewport) return state;

  return addNormalizedByKey(state, diagramID, { ...viewport, diagramID });
};

const viewportCRUDReducer = createCRUDReducer<ViewportModel>(STATE_KEY, ({ diagramID }) => diagramID);

const viewportReducer: RootReducer<Normalized<ViewportModel>, AnyViewportAction> = (state = INITIAL_CRUD_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case ViewportAction.REHYDRATE_VIEWPORT:
      return rehydrateViewportReducer(state, action);
    default:
      return viewportCRUDReducer(state, action);
  }
};

export default persistReducer(PERSIST_CONFIG, viewportReducer);

// selectors

const { byID: byIDSelector } = createCRUDSelectors(STATE_KEY);

export const viewportByIDSelector = createSelector([byIDSelector], (getViewport) => (viewportID: string) => {
  const { diagramID, ...viewport } = getViewport(viewportID);

  return viewport;
});

// action creators

export const { update: updateViewport } = createCRUDActionCreators(STATE_KEY);

export const updateViewportForDiagram = (diagramID: string, viewport: Viewport) => updateViewport(diagramID, { ...viewport, diagramID });

export const rehydrateViewport = (diagramID: string, viewport: Viewport): RehydrateViewport =>
  createAction(ViewportAction.REHYDRATE_VIEWPORT, { diagramID, viewport });
