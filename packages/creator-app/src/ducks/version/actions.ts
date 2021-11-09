import * as Realtime from '@voiceflow/realtime-sdk';

import { createAction } from '@/ducks/utils';
import * as CRUD from '@/ducks/utils/crud';
import { Action } from '@/store/types';

import { STATE_KEY } from './constants';

// action types

export enum VersionAction {
  UPDATE_SETTINGS = 'VERSION:SETTINGS:UPDATE',
  UPDATE_PUBLISHING = 'VERSION:PUBLISHING:UPDATE',
  UPDATE_SESSION = 'VERSION:SESSION:UPDATE',
}

export type UpdateSettings<T extends Realtime.AnyVersionSettings> = Action<VersionAction.UPDATE_SETTINGS, { id: string; settings: Partial<T> }>;

export type UpdatePublishing<T extends Realtime.AnyVersionPublishing> = Action<
  VersionAction.UPDATE_PUBLISHING,
  { id: string; publishing: Partial<T> }
>;

export type UpdateSession = Action<VersionAction.UPDATE_SESSION, { id: string; session: Partial<Realtime.Version.Session> }>;

export type AnyVersionAction =
  | CRUD.AnyCRUDAction<Realtime.AnyVersion>
  | UpdateSettings<Realtime.AnyVersionSettings>
  | UpdatePublishing<Realtime.AnyVersionPublishing>
  | UpdateSession;

// action creators

/**
 * @deprecated
 */
export const crud = CRUD.createCRUDActionCreators(STATE_KEY);

/**
 * @deprecated
 */
export const updatePublishingByVersionID = <T extends Realtime.AnyVersionPublishing>(id: string, publishing: Partial<T>): UpdatePublishing<T> =>
  createAction(VersionAction.UPDATE_PUBLISHING, { id, publishing });

/**
 * @deprecated
 */
export const updateSettingsByVersionID = <T extends Realtime.AnyVersionSettings>(id: string, settings: Partial<T>): UpdateSettings<T> =>
  createAction(VersionAction.UPDATE_SETTINGS, { id, settings });

/**
 * @deprecated
 */
export const updateSessionByVersionID = (id: string, session: Partial<Realtime.Version.Session>): UpdateSession =>
  createAction(VersionAction.UPDATE_SESSION, { id, session });
