import axios from 'axios';
import { createSelector } from 'reselect';

import { createAction, createRootSelector } from '@/ducks/utils';
import { Action, RootReducer, Thunk } from '@/store/types';
import { getErrorMessage, normalizeError } from '@/utils/error';

export interface IntegrationUser {
  platform: string;
}

export type IntegrationUsers = Record<string, IntegrationUser[]>;

export interface IntegrationState {
  integration_users: IntegrationUsers;
  loading: boolean;
  error: unknown | null;
}

export const STATE_KEY = 'integrationUsers';
export const INITIAL_STATE: IntegrationState = {
  integration_users: {},
  loading: false,
  error: null,
};

export enum IntegrationAction {
  FETCH_INTEGRATION_USERS_BEGIN = 'FETCH_INTEGRATION_USERS_BEGIN',
  FETCH_INTEGRATION_USERS_SUCCESS = 'FETCH_INTEGRATION_USERS_SUCCESS',
  FETCH_INTEGRATION_USERS_FAILURE = 'FETCH_INTEGRATION_USERS_FAILURE',
  ADD_INTEGRATION_USER_BEGIN = 'ADD_INTEGRATION_USER_BEGIN',
  ADD_INTEGRATION_USER_SUCCESS = 'ADD_INTEGRATION_USER_SUCCESS',
  ADD_INTEGRATION_USER_FAILURE = 'ADD_INTEGRATION_USER_FAILURE',
  DELETE_INTEGRATION_USER_BEGIN = 'DELETE_INTEGRATION_USER_BEGIN',
  DELETE_INTEGRATION_USER_SUCCESS = 'DELETE_INTEGRATION_USER_SUCCESS',
  DELETE_INTEGRATION_USER_FAILURE = 'DELETE_INTEGRATION_USER_FAILURE',
}

// action types

export type FetchIntegrationUsersBegin = Action<IntegrationAction.FETCH_INTEGRATION_USERS_BEGIN>;

export type FetchIntegrationUsersSuccess = Action<IntegrationAction.FETCH_INTEGRATION_USERS_SUCCESS, { integration_users: IntegrationUsers }>;

export type FetchIntegrationUsersFailure = Action<
  IntegrationAction.FETCH_INTEGRATION_USERS_FAILURE,
  { error: string | Error | { response: { data: string | object } } }
>;

export type AddIntegrationUserBegin = Action<IntegrationAction.ADD_INTEGRATION_USER_BEGIN>;

export type AddIntegrationUserSuccess = Action<IntegrationAction.ADD_INTEGRATION_USER_SUCCESS, { new_integration_users: IntegrationUsers }>;

export type AddIntegrationUserFailure = Action<IntegrationAction.ADD_INTEGRATION_USER_FAILURE, { error: string }>;

export type DeleteIntegrationUserBegin = Action<IntegrationAction.DELETE_INTEGRATION_USER_BEGIN>;

export type DeleteIntegrationUserSuccess = Action<IntegrationAction.DELETE_INTEGRATION_USER_SUCCESS, { new_integration_users: IntegrationUsers }>;

export type DeleteIntegrationUserFailure = Action<IntegrationAction.DELETE_INTEGRATION_USER_FAILURE, { error: Error }>;

type AnyIntegrationAction =
  | FetchIntegrationUsersBegin
  | FetchIntegrationUsersSuccess
  | FetchIntegrationUsersFailure
  | AddIntegrationUserBegin
  | AddIntegrationUserSuccess
  | AddIntegrationUserFailure
  | DeleteIntegrationUserBegin
  | DeleteIntegrationUserSuccess
  | DeleteIntegrationUserFailure;

const skillReducer: RootReducer<IntegrationState, AnyIntegrationAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case IntegrationAction.FETCH_INTEGRATION_USERS_BEGIN:
    case IntegrationAction.ADD_INTEGRATION_USER_BEGIN:
    case IntegrationAction.DELETE_INTEGRATION_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case IntegrationAction.FETCH_INTEGRATION_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_users: action.payload.integration_users,
      };
    case IntegrationAction.FETCH_INTEGRATION_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        integration_users: {},
      };
    case IntegrationAction.ADD_INTEGRATION_USER_SUCCESS:
    case IntegrationAction.DELETE_INTEGRATION_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_users: action.payload.new_integration_users,
      };
    case IntegrationAction.ADD_INTEGRATION_USER_FAILURE:
    case IntegrationAction.DELETE_INTEGRATION_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default skillReducer;

// selectors

export const integrationUsersStateSelector = createRootSelector(STATE_KEY);

export const integrationUsersSelector = createSelector(integrationUsersStateSelector, ({ integration_users }) => integration_users);

export const integrationUsersLoadingSelector = createSelector(integrationUsersStateSelector, ({ loading }) => loading);

export const integrationUsersErrorSelector = createSelector(integrationUsersStateSelector, ({ error }) => error);

// action creators

export const fetchIntegrationUsersBegin = (): FetchIntegrationUsersBegin => createAction(IntegrationAction.FETCH_INTEGRATION_USERS_BEGIN);

export const fetchIntegrationUsersFailure = (error: Error): FetchIntegrationUsersFailure =>
  createAction(IntegrationAction.FETCH_INTEGRATION_USERS_FAILURE, { error });

export const fetchIntegrationUsersSuccess = (integration_users: IntegrationUsers): FetchIntegrationUsersSuccess =>
  createAction(IntegrationAction.FETCH_INTEGRATION_USERS_SUCCESS, { integration_users });

export const addIntegrationUserBegin = (): AddIntegrationUserBegin => createAction(IntegrationAction.ADD_INTEGRATION_USER_BEGIN);

export const addIntegrationUserSuccess = (new_integration_users: IntegrationUsers): AddIntegrationUserSuccess =>
  createAction(IntegrationAction.ADD_INTEGRATION_USER_SUCCESS, { new_integration_users });

export const addIntegrationUserFailure = (error: string): AddIntegrationUserFailure =>
  createAction(IntegrationAction.ADD_INTEGRATION_USER_FAILURE, { error });

export const deleteIntegrationUserBegin = (): DeleteIntegrationUserBegin => createAction(IntegrationAction.DELETE_INTEGRATION_USER_BEGIN);

export const deleteIntegrationUserSuccess = (new_integration_users: IntegrationUsers): DeleteIntegrationUserSuccess =>
  createAction(IntegrationAction.DELETE_INTEGRATION_USER_SUCCESS, { new_integration_users });

export const deleteIntegrationUserFailure = (error: Error): DeleteIntegrationUserFailure =>
  createAction(IntegrationAction.DELETE_INTEGRATION_USER_FAILURE, { error });

// side effects

const buildDictByPlatform = (users: IntegrationUser[]) =>
  users.reduce<Record<string, IntegrationUser[]>>((acc, user) => {
    if (!acc[user.platform]) acc[user.platform] = [];
    acc[user.platform].push(user);

    return acc;
  }, {});

export const fetchIntegrationUsers = (): Thunk => async (dispatch) => {
  try {
    dispatch(fetchIntegrationUsersBegin());

    const resp = await axios.post<IntegrationUser[]>('/integrations/get_users');

    const dictByPlatform = buildDictByPlatform(resp.data);

    dispatch(fetchIntegrationUsersSuccess(dictByPlatform));
  } catch (error) {
    dispatch(fetchIntegrationUsersFailure(normalizeError(error)));

    throw normalizeError(error);
  }
};

export const addIntegrationUser =
  (
    integration: string,
    body: {
      user_info: unknown;
      creator_id: number;
      skill_id: string;
    }
  ): Thunk<unknown> =>
  async (dispatch) => {
    dispatch(addIntegrationUserBegin());
    try {
      const resp = await axios.post<IntegrationUser[]>('/integrations/add_user', {
        integration,
        ...body,
      });

      const dictByPlatform = buildDictByPlatform(resp.data);

      dispatch(addIntegrationUserSuccess(dictByPlatform));

      return dictByPlatform;
    } catch (error) {
      const message = getErrorMessage(error);

      dispatch(addIntegrationUserFailure(message));

      throw message;
    }
  };

export const deleteIntegrationUser =
  (
    integration: string,
    body: {
      user: unknown;
      creator_id: number;
      skill_id: string;
    }
  ): Thunk =>
  async (dispatch) => {
    dispatch(deleteIntegrationUserBegin());
    try {
      const resp = await axios.post('/integrations/delete_user', {
        integration,
        ...body,
      });

      const dictByPlatform = buildDictByPlatform(resp.data);

      dispatch(deleteIntegrationUserSuccess(dictByPlatform));
    } catch (e) {
      dispatch(deleteIntegrationUserFailure(normalizeError(e)));
      throw e;
    }
  };
