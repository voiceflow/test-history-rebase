import { Action, ActionPayload, createAction } from '@voiceflow/ui';

import { SessionUser } from '@/models';

export enum AccountAction {
  UPDATE_ACCOUNT = 'ACCOUNT:UPDATE',
  RESET_ACCOUNT = 'ACCOUNT:RESET',
  UPDATE_VENDORS = 'ACCOUNT:VENDORS:UPDATE',
}

// action types

export type UpdateAccount = Action<AccountAction.UPDATE_ACCOUNT, SessionUser>;

export type UpdateVendors = Action<AccountAction.UPDATE_VENDORS, string[]>;

export type ResetAccount = Action<AccountAction.RESET_ACCOUNT>;

export type AnyAccountAction = UpdateAccount | ResetAccount | UpdateVendors;

// action creators

export const updateAccount = (payload: ActionPayload<UpdateAccount>): UpdateAccount => createAction(AccountAction.UPDATE_ACCOUNT, payload);

export const UpdateVendors = (payload: ActionPayload<UpdateVendors>): UpdateVendors => createAction(AccountAction.UPDATE_VENDORS, payload);

export const resetAccount = (): ResetAccount => createAction(AccountAction.RESET_ACCOUNT);
