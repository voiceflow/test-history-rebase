import { NullableRecord } from '@voiceflow/common';

import { Account } from '@/models';

export type AccountState = NullableRecord<Account> & {
  loading: boolean;
  admin: number;
  amazon: Account.Amazon | null;
  google: Account.Google | null;
  verified: boolean;
  first_login: boolean;
  referrer_id: number | null;
  referral_code: string | null;
  gid: string | null;
  fid: string | null;
  okta_id: string | null;
  saml_provider_id: string | null;
};
