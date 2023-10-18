import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createAction } from '@voiceflow/ui';
import { createSelector } from 'reselect';

import client from '@/client';
import { IS_PRODUCTION } from '@/config';
import { SessionAction, SetActiveWorkspaceID, SetAuthToken } from '@/ducks/session/actions';
import { activeWorkspaceIDSelector } from '@/ducks/session/selectors';
import type { Action, Reducer, RootReducer, Thunk } from '@/store/types';

import { createRootSelector } from './utils/selector';

export type FeatureFlagMap = Partial<Record<Realtime.FeatureFlag, { isEnabled: boolean }>>;

export interface FeatureState {
  features: FeatureFlagMap;
  isLoaded: boolean;
  isWorkspaceLoaded: boolean;
}

export const STATE_KEY = 'feature';
export const INITIAL_STATE: FeatureState = {
  features: {},
  isLoaded: false,
  isWorkspaceLoaded: false,
};

// actions

export enum FeatureAction {
  SET_FEATURES_LOADED = 'FEATURE:SET_LOADED',
  UNSET_WORKSPACE_FEATURES_LOADED = 'FEATURE:UNSET_WORKSPACE_LOADED',
  SET_WORKSPACE_FEATURES_LOADED = 'FEATURE:SET_WORKSPACE_LOADED',
}

export type SetFeaturesLoaded = Action<FeatureAction.SET_FEATURES_LOADED, FeatureFlagMap>;

export type UnsetWorkspaceFeaturesLoaded = Action<FeatureAction.UNSET_WORKSPACE_FEATURES_LOADED>;

export type SetWorkspaceFeaturesLoaded = Action<FeatureAction.SET_WORKSPACE_FEATURES_LOADED, FeatureFlagMap>;

type AnyFeatureAction = SetFeaturesLoaded | UnsetWorkspaceFeaturesLoaded | SetWorkspaceFeaturesLoaded | SetAuthToken | SetActiveWorkspaceID;

// reducers

const setFeaturesLoadedReducer: Reducer<FeatureState, SetFeaturesLoaded> = (state, { payload: features }) => ({
  ...state,
  features,
  isLoaded: true,
});

const unsetWorkspaceFeaturesLoadedReducer: Reducer<FeatureState> = (state) => ({
  ...state,
  isWorkspaceLoaded: false,
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

const featureReducer: RootReducer<FeatureState, AnyFeatureAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FeatureAction.SET_FEATURES_LOADED:
      return setFeaturesLoadedReducer(state, action);
    case FeatureAction.SET_WORKSPACE_FEATURES_LOADED:
      return setWorkspaceFeaturesLoadedReducer(state, action);
    case FeatureAction.UNSET_WORKSPACE_FEATURES_LOADED:
      return unsetWorkspaceFeaturesLoadedReducer(state);
    case SessionAction.SET_AUTH_TOKEN:
      return accountChangeReducer(state);
    default:
      return state;
  }
};

export default featureReducer;

// selectors

export const rootSelector = createRootSelector(STATE_KEY);

export const featuresSelector = createSelector([rootSelector], ({ features }) => features);

export const featureSelector = createSelector(
  [featuresSelector],
  (features) => (featureID: Realtime.FeatureFlag) => features[featureID] ?? { isEnabled: false }
);

export const allActiveFeaturesSelector = createSelector([rootSelector], ({ features }) => features);

export const isFeatureEnabledSelector = createSelector(
  [featureSelector],
  (getFeature) => (featureID: Realtime.FeatureFlag) => getFeature(featureID).isEnabled
);

export const featureSelectorFactory =
  (feature: Realtime.FeatureFlag) =>
  <S1 extends (state: any) => any, S2 extends (state: any) => any>(selector: S1, featureSelector: S2) =>
    createSelector([isFeatureEnabledSelector, selector, featureSelector], (isFeatureEnabled, value1, value2) =>
      isFeatureEnabled(feature) ? value2 : value1
    );

export const isLoadedSelector = createSelector([rootSelector], ({ isLoaded }) => isLoaded);

export const isWorkspaceLoadedSelector = createSelector([rootSelector], ({ isWorkspaceLoaded }) => isWorkspaceLoaded);

// action creators

export const setFeaturesLoaded = (features: FeatureState['features']): SetFeaturesLoaded => createAction(FeatureAction.SET_FEATURES_LOADED, features);

export const unsetWorkspaceFeaturesLoaded = (): UnsetWorkspaceFeaturesLoaded => createAction(FeatureAction.UNSET_WORKSPACE_FEATURES_LOADED);

export const setWorkspaceFeaturesLoaded = (features: FeatureState['features']): SetWorkspaceFeaturesLoaded =>
  createAction(FeatureAction.SET_WORKSPACE_FEATURES_LOADED, features);

// side effects

const overrideFeatures = (features: Record<string, { isEnabled: boolean }>) => {
  if (IS_PRODUCTION) return features;

  return Object.fromEntries(
    Object.entries(features).map(([key, value]) => {
      const envVar = `VF_APP_FF_${key.toUpperCase()}`;
      if (Utils.object.hasProperty(import.meta.env, envVar)) {
        return [key, { isEnabled: import.meta.env[envVar] === 'true' }];
      }

      return [key, value];
    })
  );
};

export const loadFeatures = (): Thunk => async (dispatch) => {
  const features = await client.feature.getStatuses();

  dispatch(setFeaturesLoaded(overrideFeatures(features)));
};

export const loadWorkspaceFeatures = (): Thunk => async (dispatch, getState) => {
  const workspaceID = activeWorkspaceIDSelector(getState());

  if (!workspaceID) {
    return;
  }

  const organization = await client.identity.workspace.getOrganization(workspaceID).catch(() => null);

  const features = await client.feature.getStatuses({ workspaceID, organizationID: organization?.id });

  dispatch(setWorkspaceFeaturesLoaded(overrideFeatures(features)));
};
