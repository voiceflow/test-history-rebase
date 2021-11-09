import { Utils } from '@voiceflow/common';
import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';
import { createAction } from '@/ducks/utils';
import createCRUDReducer, * as CRUD from '@/ducks/utils/crud';
import { Action, Reducer, RootReducer } from '@/store/types';
import { Viewport } from '@/types';

export const STATE_KEY = 'viewport';
const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
};

export type ViewportModel = Viewport & { diagramID: string };

export type ViewportState = CRUD.CRUDState<ViewportModel>;

export const INITIAL_STATE: ViewportState = CRUD.createCRUDState();

// actions

export enum ViewportAction {
  REHYDRATE_VIEWPORT = 'VIEWPORT:REHYDRATE',
}

export type RehydrateViewport = Action<ViewportAction.REHYDRATE_VIEWPORT, { diagramID: string; viewport: Viewport }>;

type AnyViewportAction = CRUD.AnyCRUDAction<ViewportModel> | RehydrateViewport;

// reducers

export const rehydrateViewportReducer: Reducer<ViewportState, RehydrateViewport> = (state, { payload: { diagramID, viewport } }) => {
  const currentViewport = Utils.normalized.getNormalizedByKey(state, diagramID);

  if (currentViewport) return state;

  return Utils.normalized.addNormalizedByKey(state, diagramID, { ...viewport, diagramID });
};

const viewportCRUDReducer = createCRUDReducer<ViewportModel>(STATE_KEY, ({ diagramID }) => diagramID);

const viewportReducer: RootReducer<ViewportState, AnyViewportAction> = (state = INITIAL_STATE, action) => {
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

const { byID: byIDSelector } = CRUD.createCRUDSelectors(STATE_KEY);

export const viewportByIDSelector = createSelector([byIDSelector], (getViewport) => (viewportID: string) => {
  const { diagramID, ...viewport } = getViewport(viewportID);

  return viewport;
});

export const activeDiagramViewportSelector = createSelector([Session.activeDiagramIDSelector, viewportByIDSelector], (diagramID, getViewportByID) =>
  diagramID ? getViewportByID(diagramID) : null
);

// action creators

export const { update: updateViewport } = CRUD.createCRUDActionCreators(STATE_KEY);

export const updateViewportForDiagram = (diagramID: string, viewport: Viewport) => updateViewport(diagramID, { ...viewport, diagramID });

export const rehydrateViewport = (diagramID: string, viewport: Viewport): RehydrateViewport =>
  createAction(ViewportAction.REHYDRATE_VIEWPORT, { diagramID, viewport });
