import { createSelector } from 'reselect';

import client from '@/client';
import { LOCAL_FEATURE_OVERRIDES } from '@/config/features';

import { createAction, createRootSelector } from './utils';

export const STATE_KEY = 'feature';
export const INITIAL_STATE = {
  isLoaded: false,
  features: {},
};

const FEATURE_REFRESH_TIMEOUT = 60 * 1000;

// actions

export const UPDATE_FEATURE_STATUS = 'FEATURE:UPDATE_STATUS';
export const SET_FEATURES_LOADED = 'FEATURE:SET_LOADED';

// reducers

const updateFeatureStatusReducer = (state, { payload: { featureID, isEnabled, lastUpdated } }) => ({
  ...state,
  features: {
    ...state.features,
    [featureID]: { isEnabled, lastUpdated },
  },
});

const setFeaturesLoadedReducer = (state) => ({
  ...state,
  isLoaded: true,
});

const featureReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_FEATURE_STATUS:
      return updateFeatureStatusReducer(state, action);
    case SET_FEATURES_LOADED:
      return setFeaturesLoadedReducer(state);
    default:
      return state;
  }
};

export default featureReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const featureSelector = createSelector(rootSelector, ({ features }) => (featureID) => features[featureID] ?? {});

export const isFeatureEnabledSelector = createSelector(featureSelector, (getFeature) => (featureID) =>
  LOCAL_FEATURE_OVERRIDES[featureID] || (getFeature(featureID).isEnabled ?? null)
);

export const isLoadedSelector = createSelector(rootSelector, ({ isLoaded }) => isLoaded);

// action creators

export const updateFeatureStatus = (featureID, isEnabled) => createAction(UPDATE_FEATURE_STATUS, { featureID, isEnabled, lastUpdated: Date.now() });

export const setFeaturesLoaded = () => createAction(SET_FEATURES_LOADED);

// side effects

export const refreshFeature = (featureID) => async (dispatch, getState) => {
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

export const loadFeatures = () => async (dispatch) => {
  const features = await client.feature.find();

  await Promise.all(features.map((featureID) => dispatch(refreshFeature(featureID))));

  dispatch(setFeaturesLoaded());
};
