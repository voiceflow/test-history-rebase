import { createStructuredSelector } from 'reselect';

import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { State, SyncThunk } from '@/store/types';
import { NonNullableRecord } from '@/types';

import { duckLogger } from '../utils';
import { STATE_KEY } from './constants';

const WORKSPACE_FALLBACK_ERROR_MESSAGE = 'Error updating Workspace';

export const log = duckLogger.child(STATE_KEY);

export const extractErrorMessages = (err?: {
  body?: { errors?: Record<string, { message: string } | string> } & Record<string, { message: string } | string>;
}) => {
  const errors = err?.body?.errors || err?.body || {};

  const errorMessage = Object.keys(errors).reduce<string>((str, key) => {
    const error = errors[key];

    return `${str}${(typeof error === 'object' && error.message) || error}\n`;
  }, '');

  return errorMessage || WORKSPACE_FALLBACK_ERROR_MESSAGE;
};

export const extractErrorFromResponseData = (err: Partial<Record<'response' | 'body', { data?: string }>> | undefined, defaultMessage: string) =>
  err?.response?.data || err?.body?.data || (err && JSON.stringify(err)) || defaultMessage;

export interface ActiveWorkspaceContext {
  workspaceID: string | null;
}

export const activeWorkspaceContextSelector = createStructuredSelector<State, ActiveWorkspaceContext>({
  workspaceID: Session.activeWorkspaceIDSelector,
});

export const getActiveWorkspaceContext = (): SyncThunk<NonNullableRecord<ActiveWorkspaceContext>> => (_dispatch, getState) => {
  const context = activeWorkspaceContextSelector(getState());

  Errors.assertWorkspaceID(context.workspaceID);

  return context as NonNullableRecord<ActiveWorkspaceContext>;
};
