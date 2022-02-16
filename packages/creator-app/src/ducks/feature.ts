import { createSelector } from 'reselect';

import client from '@/client';
import { IS_PRODUCTION } from '@/config';
import { FeatureFlag, LOCAL_FEATURE_OVERRIDES } from '@/config/features';
import * as Session from '@/ducks/session';
import { Action, Reducer, RootReducer, Selector, SyncThunk, Thunk } from '@/store/types';

import { createAction, createRootSelector } from './utils';

export type FeatureFlagMap = Partial<Record<FeatureFlag, { isEnabled: boolean }>>;

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

export const featureSelector = createSelector(
  [featuresSelector],
  (features) => (featureID: FeatureFlag) => features[featureID] ?? { isEnabled: null }
);

export const allActiveFeaturesSelector = createSelector([rootSelector], ({ features }) =>
  Object.keys(features).reduce((acc: Record<string, { isEnabled: boolean }>, key: string) => {
    if (features[key as FeatureFlag]?.isEnabled || (!IS_PRODUCTION && LOCAL_FEATURE_OVERRIDES[key as FeatureFlag])) {
      return { ...acc, [key]: { isEnabled: true } };
    }
    return acc;
  }, {})
);

export const isFeatureEnabledSelector = createSelector(
  [featureSelector],
  (getFeature) => (featureID: FeatureFlag) => (!IS_PRODUCTION && LOCAL_FEATURE_OVERRIDES[featureID]) || (getFeature(featureID).isEnabled ?? null)
);

export const featureSelectorFactory =
  (
    feature: FeatureFlag
  ): {
    <T, P1, P2, P3, R1, R2, R3, V1, V2>(
      selectors: [
        selectorV1: Selector<V1, [P1, P2, P3]>,
        selectorV2: Selector<V2, [P1, P2, P3]>,
        paramSelector1: Selector<R1, [P1, P2, P3]>,
        paramSelector2: Selector<R2, [P1, P2, P3]>,
        paramSelector3: Selector<R3, [P1, P2, P3]>
      ],
      reducer: (valueV1: V1, valueV2: V2, param1: R1, param2: R2, param3: R3) => [T, T]
    ): Selector<T, [P1 & P2 & P3]>;

    <T, P1, P2, R1, R2, V1, V2>(
      selectors: [
        selectorV1: Selector<V1, [P1, P2]>,
        selectorV2: Selector<V2, [P1, P2]>,
        paramSelector1: Selector<R1, [P1, P2]>,
        paramSelector2: Selector<R2, [P1, P2]>
      ],
      reducer: (valueV1: V1, valueV2: V2, param1: R1, param2: R2) => [T, T]
    ): Selector<T, [P1 & P2]>;

    <T, P, R, V1, V2>(
      selectors: [selectorV1: Selector<V1, [P]>, selectorV2: Selector<V2, [P]>, paramSelector: Selector<R, [P]>],
      reducer: (valueV1: V1, valueV2: V2, param: R) => [T, T]
    ): Selector<T, [P]>;

    <T, P>(selectors: [selectorV1: Selector<T>, selectorV2: Selector<T>, paramSelector: Selector<P>]): Selector<T, [P]>;

    <T, V1, V2>(selectors: [selectorV1: Selector<V1>, selectorV2: Selector<V2>], reducer: (valueV1: V1, valueV2: V2) => [T, T]): Selector<T>;

    <T>(selectors: [selectorV1: Selector<T>, selectorV2: Selector<T>]): Selector<T>;
  } =>
  (selectors: Selector<any, any[]>[], reducer?: (valueV1: any, valueV2: any, param1?: any, param2?: any, param3?: any) => [any, any]) =>
    // eslint-disable-next-line max-params
    createSelector([isFeatureEnabledSelector, ...selectors], (isFeatureEnabled, rawValueV1, rawValueV2, param1, param2, param3) => {
      const [valueV1, valueV2] = reducer ? reducer(rawValueV1, rawValueV2, param1, param2, param3) : [rawValueV1, rawValueV2];

      return isFeatureEnabled(feature) ? valueV2 : valueV1;
    });

export const createAtomicActionsSelector = featureSelectorFactory(FeatureFlag.ATOMIC_ACTIONS);
export const createAtomicActionsPhase2Selector = featureSelectorFactory(FeatureFlag.ATOMIC_ACTIONS_PHASE_2);

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

  const organization = await client.workspace.getOrganization(workspaceID);
  const features = await client.feature.getStatuses({ workspaceID, organizationID: organization?.id });

  dispatch(setWorkspaceFeaturesLoaded(features));
};

export const applyAtomicSideEffect =
  <C, R = void>(contextThunk: () => SyncThunk<C>, thunkV1: () => R, thunkV2: (context: C) => R): SyncThunk<R> =>
  (dispatch, getState) => {
    const isAtomicActions = isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) {
      const context = dispatch(contextThunk());

      return thunkV2(context);
    }

    return thunkV1();
  };
