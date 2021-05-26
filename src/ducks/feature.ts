import { createSelector } from 'reselect';

import client from '@/client';
import { IS_PRODUCTION } from '@/config';
import { FeatureFlag, LOCAL_FEATURE_OVERRIDES } from '@/config/features';
import * as Session from '@/ducks/session';
import { Action, Reducer, RootReducer, Thunk } from '@/store/types';

import { createAction, createRootSelector } from './utils';

export type FeatureFlagMap = Partial<Record<FeatureFlag, { isEnabled: boolean }>>;

export type FeatureState = {
  features: FeatureFlagMap;
  isLoaded: boolean;
  isWorkspaceLoaded: boolean;
};

export const STATE_KEY = 'feature';
export const INITIAL_STATE: FeatureState = {
  features: {},
  isLoaded: false,
  isWorkspaceLoaded: false,
};

// actions

export enum FeatureAction {
  SET_FEATURES_LOADED = 'FEATURE:SET_LOADED',
  SET_WORKSPACE_FEATURES_LOADED = 'FEATURE:SET_WORKSPACE_LOADED',
}

export type SetFeaturesLoaded = Action<FeatureAction.SET_FEATURES_LOADED, FeatureFlagMap>;

export type SetWorkspaceFeaturesLoaded = Action<FeatureAction.SET_WORKSPACE_FEATURES_LOADED, FeatureFlagMap>;

type AnyFeatureAction = SetFeaturesLoaded | SetWorkspaceFeaturesLoaded | Session.SetAuthToken | Session.SetActiveWorkspaceID;

// reducers

const setFeaturesLoadedReducer: Reducer<FeatureState, SetFeaturesLoaded> = (state, { payload: features }) => ({
  ...state,
  features,
  isLoaded: true,
});

const setWorkspaceFeaturesLoadedReducer: Reducer<FeatureState, SetWorkspaceFeaturesLoaded> = (state, { payload: features }) => ({
  ...state,
  features,
  isWorkspaceLoaded: true,
});

const accountChangeReducer: Reducer<FeatureState> = (state) => ({
  ...state,
  isLoaded: false,
  isWorkspaceLoaded: false,
});

const workspaceChangeReducer: Reducer<FeatureState> = (state) => ({
  ...state,
  isWorkspaceLoaded: false,
});

const featureReducer: RootReducer<FeatureState, AnyFeatureAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FeatureAction.SET_FEATURES_LOADED:
      return setFeaturesLoadedReducer(state, action);
    case FeatureAction.SET_WORKSPACE_FEATURES_LOADED:
      return setWorkspaceFeaturesLoadedReducer(state, action);
    case Session.SessionAction.SET_AUTH_TOKEN:
      return accountChangeReducer(state);
    case Session.SessionAction.SET_ACTIVE_WORKSPACE_ID:
      return workspaceChangeReducer(state);
    default:
      return state;
  }
};

export default featureReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const featuresSelector = createSelector([rootSelector], ({ features }) => features);

export const featureSelector = createSelector([featuresSelector], (features) => (featureID: FeatureFlag) =>
  features[featureID] ?? { isEnabled: null }
);

export const isFeatureEnabledSelector = createSelector([featureSelector], (getFeature) => (featureID: FeatureFlag) =>
  (!IS_PRODUCTION && LOCAL_FEATURE_OVERRIDES[featureID]) || (getFeature(featureID).isEnabled ?? null)
);

export const isLoadedSelector = createSelector([rootSelector], ({ isLoaded }) => isLoaded);

export const isWorkspaceLoadedSelector = createSelector([rootSelector], ({ isWorkspaceLoaded }) => isWorkspaceLoaded);

// action creators

export const setFeaturesLoaded = (features: FeatureState['features']): SetFeaturesLoaded => createAction(FeatureAction.SET_FEATURES_LOADED, features);

export const setWorkspaceFeaturesLoaded = (features: FeatureState['features']): SetWorkspaceFeaturesLoaded =>
  createAction(FeatureAction.SET_WORKSPACE_FEATURES_LOADED, features);

// side effects

export const loadFeatures = (): Thunk => async (dispatch) => {
  const features = await client.feature.getStatuses();

  dispatch(setFeaturesLoaded(features));
};

export const loadWorkspaceFeatures = (): Thunk => async (dispatch, getState) => {
  const workspaceID = Session.activeWorkspaceIDSelector(getState());

  if (!workspaceID) {
    return;
  }

  const features = await client.feature.getStatuses({ workspaceID });

  dispatch(setWorkspaceFeaturesLoaded(features));
};
