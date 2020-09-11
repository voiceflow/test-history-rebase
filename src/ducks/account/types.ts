import { Account } from '@/models';
import { NullableRecord } from '@/types';

export type AccountState = NullableRecord<Account> & {
  loading: boolean;
  admin: number;
  amazon: Account.Amazon | null;
  google: Account.Google | null;
  first_login: boolean;
};
