import { Action, ActionPayload, createAction } from '@voiceflow/ui';

import { Board, Creator, Error, Team, Workspace } from '@/models';

export enum AdminAction {
  SET_CREATOR = 'CREATOR:SET',
  FIND_CREATOR_FAILED = 'CREATOR:FIND_FAILED',
  SET_BETA_CREATOR = 'CREATOR:BETA:SET',
  CLEAR_BETA_CREATOR = 'CREATOR:BETA:CLEAR',
  SET_ALL_BETA_USERS = 'USER:BETA:SET_ALL',
  SET_CHARGES = 'CHARGES:SET',
  SET_VENDORS = 'VENDORS:SET',
  UPDATE_WORKSPACE = 'WORKSPACE:UPDATE',
  TOGGLE_THEME = 'THEME:TOGGLE',
}

// action types

export type SetCreator = Action<AdminAction.SET_CREATOR, { creator: Creator; boards: Board[] }>;

export type FindCreatorFailed = Action<AdminAction.FIND_CREATOR_FAILED, { error: Error }>;

export type SetBetaCreator = Action<AdminAction.SET_BETA_CREATOR, { betaCreator: Creator }>;

export type ClearBetaCreator = Action<AdminAction.CLEAR_BETA_CREATOR>;

export type SetAllBetaUsers = Action<AdminAction.SET_ALL_BETA_USERS, { users: any[] }>;

export type SetCharges = Action<AdminAction.SET_CHARGES, { charges: Team[] }>;

export type SetVendors = Action<AdminAction.SET_VENDORS, { vendors: any[] }>;

export type UpdateWorkspace = Action<AdminAction.UPDATE_WORKSPACE, { workspaceID: number; data: Partial<Workspace> }>;

export type ToggleTheme = Action<AdminAction.TOGGLE_THEME, { theme: any }>;

export type AnyAdminAction =
  | SetCreator
  | FindCreatorFailed
  | SetBetaCreator
  | ClearBetaCreator
  | SetAllBetaUsers
  | SetCharges
  | SetVendors
  | UpdateWorkspace
  | ToggleTheme;

// action creators

export const setCreator = (payload: ActionPayload<SetCreator>): SetCreator => createAction(AdminAction.SET_CREATOR, payload);

export const findCreatorFailed = (payload: ActionPayload<FindCreatorFailed>): FindCreatorFailed =>
  createAction(AdminAction.FIND_CREATOR_FAILED, payload);

export const setBetaCreator = (payload: ActionPayload<SetBetaCreator>): SetBetaCreator => createAction(AdminAction.SET_BETA_CREATOR, payload);

export const clearBetaCreator = (): ClearBetaCreator => createAction(AdminAction.CLEAR_BETA_CREATOR);

export const setAllBetaUsers = (payload: ActionPayload<SetAllBetaUsers>): SetAllBetaUsers => createAction(AdminAction.SET_ALL_BETA_USERS, payload);

export const setCharges = (payload: ActionPayload<SetCharges>): SetCharges => createAction(AdminAction.SET_CHARGES, payload);

export const setVendors = (payload: ActionPayload<SetVendors>): SetVendors => createAction(AdminAction.SET_VENDORS, payload);

export const updateWorkspace = (payload: ActionPayload<UpdateWorkspace>): UpdateWorkspace => createAction(AdminAction.UPDATE_WORKSPACE, payload);

export const toggleTheme = (payload: ActionPayload<ToggleTheme>): ToggleTheme => createAction(AdminAction.TOGGLE_THEME, payload);
