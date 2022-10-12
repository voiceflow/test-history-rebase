import { Account } from '@/models';

export interface AccountState {
  creator_id: number | null;
  name: string | null;
  email: string | null;
  image: string | null;
  isSSO: boolean;
  amazon: Account.Amazon | null;
  google: Account.Google | null;
  created: string;
  loading: boolean;
  verified: boolean;
  first_login: boolean;
  referrer_id: number | null;
  referral_code: string | null;
}
