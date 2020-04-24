import { createSelector } from 'reselect';

import client from '@/client';
import { FeatureFlag, LOCAL_FEATURE_OVERRIDES } from '@/config/features';
import { Action, Reducer, RootReducer, Thunk } from '@/store/types';

import { createAction, createRootSelector } from './utils';

export type FeatureState = {
  isLoaded: boolean;
  features: Record<
    string,
    {
      isEnabled: boolean;
      lastUpdated: number;
    }
  >;
};

export const STATE_KEY = 'feature';
export const INITIAL_STATE: FeatureState = {
  isLoaded: false,
  features: {},
};

const FEATURE_REFRESH_TIMEOUT = 60 * 1000;

// actions

export enum FeatureAction {
  UPDATE_FEATURE_STATUS = 'FEATURE:UPDATE_STATUS',
  SET_FEATURES_LOADED = 'FEATURE:SET_LOADED',
}

export type UpdateFeatureStatus = Action<FeatureAction.UPDATE_FEATURE_STATUS, { featureID: FeatureFlag; isEnabled: boolean; lastUpdated: number }>;

export type SetFeaturesLoaded = Action<FeatureAction.SET_FEATURES_LOADED>;

type AnyFeatureAction = UpdateFeatureStatus | SetFeaturesLoaded;

// reducers

const updateFeatureStatusReducer: Reducer<FeatureState, UpdateFeatureStatus> = (state, { payload: { featureID, isEnabled, lastUpdated } }) => ({
  ...state,
  features: {
    ...state.features,
    [featureID]: { isEnabled, lastUpdated },
  },
});

const setFeaturesLoadedReducer: Reducer<FeatureState> = (state) => ({
  ...state,
  isLoaded: true,
});

const featureReducer: RootReducer<FeatureState, AnyFeatureAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FeatureAction.UPDATE_FEATURE_STATUS:
      return updateFeatureStatusReducer(state, action);
    case FeatureAction.SET_FEATURES_LOADED:
      return setFeaturesLoadedReducer(state);
    default:
      return state;
  }
};

export default featureReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const featureSelector = createSelector([rootSelector], ({ features }) => (featureID: FeatureFlag) => features[featureID] ?? {});

export const isFeatureEnabledSelector = createSelector([featureSelector], (getFeature) => (featureID: FeatureFlag) =>
  LOCAL_FEATURE_OVERRIDES[featureID] || (getFeature(featureID).isEnabled ?? null)
);

export const isLoadedSelector = createSelector([rootSelector], ({ isLoaded }) => isLoaded);

// action creators

export const updateFeatureStatus = (featureID: FeatureFlag, isEnabled: boolean): UpdateFeatureStatus =>
  createAction(FeatureAction.UPDATE_FEATURE_STATUS, { featureID, isEnabled, lastUpdated: Date.now() });

export const setFeaturesLoaded = (): SetFeaturesLoaded => createAction(FeatureAction.SET_FEATURES_LOADED);

// side effects

export const refreshFeature = (featureID: FeatureFlag): Thunk => async (dispatch, getState) => {
  const { isEnabled, lastUpdated } = featureSelector(getState())(featureID);

  if (Date.now() - lastUpdated < FEATURE_REFRESH_TIMEOUT) return;

  try {
    const isRemoteEnabled = await client.feature.isEnabled(featureID);

    if (isRemoteEnabled !== isEnabled) {
      dispatch(updateFeatureStatus(featureID, isRemoteEnabled));
    }
  } catch (e) {
    console.error(`failed to synchronize feature flag: ${featureID}`, e);
  }
};

export const loadFeatures = (): Thunk => async (dispatch) => {
  const features = await client.feature.find();

  await Promise.all(features.map((featureID) => dispatch(refreshFeature(featureID as FeatureFlag))));

  dispatch(setFeaturesLoaded());
};
