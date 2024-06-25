import type * as PlatformConfig from '@voiceflow/platform-config';

import type { Action } from '@/store/types';

import { createAction } from '../utils';
import type { AccountState } from './types';

export enum AccountAction {
  RESET_ACCOUNT = 'RESET_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  UPDATE_AMAZON_ACCOUNT = 'UPDATE_AMAZON_ACCOUNT',
  UPDATE_GOOGLE_ACCOUNT = 'UPDATE_GOOGLE_ACCOUNT',
}

// action types

export type UpdateGoogleAccount = Action<AccountAction.UPDATE_GOOGLE_ACCOUNT, PlatformConfig.Google.Types.Account>;

export type UpdateAmazonAccount = Action<
  AccountAction.UPDATE_AMAZON_ACCOUNT,
  Partial<PlatformConfig.Alexa.Types.Account>
>;

export type UpdateAccount = Action<AccountAction.UPDATE_ACCOUNT, Partial<AccountState>>;

export type ResetAccount = Action<AccountAction.RESET_ACCOUNT>;

export type AnyAccountAction = UpdateGoogleAccount | UpdateAmazonAccount | UpdateAccount | ResetAccount;

export const resetAccount = (): ResetAccount => createAction(AccountAction.RESET_ACCOUNT);

export const updateAccount = (account: Partial<AccountState>): UpdateAccount =>
  createAction(AccountAction.UPDATE_ACCOUNT, account);

export const updateAmazonAccount = (account: Partial<PlatformConfig.Alexa.Types.Account>): UpdateAmazonAccount =>
  createAction(AccountAction.UPDATE_AMAZON_ACCOUNT, account);

export const updateGoogleAccount = (account: PlatformConfig.Google.Types.Account): UpdateGoogleAccount =>
  createAction(AccountAction.UPDATE_GOOGLE_ACCOUNT, account);
