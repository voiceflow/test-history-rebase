import { createSelector } from 'reselect';

import client from '@/client';
import { IS_PRODUCTION } from '@/config';
import { FeatureFlag, LOCAL_FEATURE_OVERRIDES } from '@/config/features';
import * as Session from '@/ducks/session';
import { Action, Reducer, RootReducer, Thunk } from '@/store/types';

import { createAction, createRootSelector } from './utils';

export type FeatureState = {
  isLoaded: boolean;
  features: Record<
    string,
    {
      isEnabled: boolean;
    }
  >;
};

export const STATE_KEY = 'feature';
export const INITIAL_STATE: FeatureState = {
  isLoaded: false,
  features: {},
};

// actions

export enum FeatureAction {
  UPDATE_ALL_STATUSES = 'FEATURE:STATUS:UPDATE_ALL',
  SET_FEATURES_LOADED = 'FEATURE:SET_LOADED',
}

export type UpdateAllStatuses = Action<FeatureAction.UPDATE_ALL_STATUSES, Record<FeatureFlag, { isEnabled: boolean }>>;

export type SetFeaturesLoaded = Action<FeatureAction.SET_FEATURES_LOADED, boolean>;

type AnyFeatureAction = UpdateAllStatuses | SetFeaturesLoaded | Session.SetAuthToken;

// reducers

const updateAllStatusesReducer: Reducer<FeatureState, UpdateAllStatuses> = (state, { payload: features }) => ({
  ...state,
  features,
});

const setFeaturesLoadedReducer: Reducer<FeatureState> = (state) => ({
  ...state,
  isLoaded: true,
});

const accountChangeReducer: Reducer<FeatureState> = (state) => ({
  ...state,
  isLoaded: false,
});

const featureReducer: RootReducer<FeatureState, AnyFeatureAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FeatureAction.UPDATE_ALL_STATUSES:
      return updateAllStatusesReducer(state, action);
    case FeatureAction.SET_FEATURES_LOADED:
      return setFeaturesLoadedReducer(state);
    case Session.SessionAction.SET_AUTH_TOKEN:
      return accountChangeReducer(state);
    default:
      return state;
  }
};

export default featureReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const featureSelector = createSelector([rootSelector], ({ features }) => (featureID: FeatureFlag) => features[featureID] ?? {});

export const isFeatureEnabledSelector = createSelector([featureSelector], (getFeature) => (featureID: FeatureFlag) =>
  (!IS_PRODUCTION && LOCAL_FEATURE_OVERRIDES[featureID]) || (getFeature(featureID).isEnabled ?? null)
);

export const isLoadedSelector = createSelector([rootSelector], ({ isLoaded }) => isLoaded);

// action creators

export const updateAllStatuses = (features: FeatureState['features']): UpdateAllStatuses => createAction(FeatureAction.UPDATE_ALL_STATUSES, features);

export const setFeaturesLoaded = (): SetFeaturesLoaded => createAction(FeatureAction.SET_FEATURES_LOADED);

// side effects

export const loadFeatures = (): Thunk => async (dispatch) => {
  const features = await client.feature.getStatuses();

  dispatch(updateAllStatuses(features));
  dispatch(setFeaturesLoaded());
};
