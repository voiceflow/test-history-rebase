import { Account } from '@/models';
import { Action } from '@/store/types';

import { createAction } from '../utils';
import { AccountState } from './types';

export enum AccountAction {
  RESET_ACCOUNT = 'RESET_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  UPDATE_AMAZON_ACCOUNT = 'UPDATE_AMAZON_ACCOUNT',
  UPDATE_GOOGLE_ACCOUNT = 'UPDATE_GOOGLE_ACCOUNT',
}

// action types

export type UpdateGoogleAccount = Action<AccountAction.UPDATE_GOOGLE_ACCOUNT, Account.Google>;

export type UpdateAmazonAccount = Action<AccountAction.UPDATE_AMAZON_ACCOUNT, Partial<Account.Amazon>>;

export type UpdateAccount = Action<AccountAction.UPDATE_ACCOUNT, Partial<AccountState>>;

export type ResetAccount = Action<AccountAction.RESET_ACCOUNT>;

export type AnyAccountAction = UpdateGoogleAccount | UpdateAmazonAccount | UpdateAccount | ResetAccount;

export const resetAccount = (): ResetAccount => createAction(AccountAction.RESET_ACCOUNT);

export const updateAccount = (account: Partial<AccountState>): UpdateAccount => createAction(AccountAction.UPDATE_ACCOUNT, account);

export const updateAmazonAccount = (account: Partial<Account.Amazon>): UpdateAmazonAccount =>
  createAction(AccountAction.UPDATE_AMAZON_ACCOUNT, account);

export const updateGoogleAccount = (account: Account.Google): UpdateGoogleAccount => createAction(AccountAction.UPDATE_GOOGLE_ACCOUNT, account);
