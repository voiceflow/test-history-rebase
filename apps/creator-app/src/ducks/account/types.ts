import * as PlatformConfig from '@voiceflow/platform-config';

export interface AccountState {
  creator_id: number | null;
  name: string | null;
  email: string | null;
  image: string | null;
  isSSO: boolean;
  amazon: PlatformConfig.Alexa.Types.Account | null;
  google: PlatformConfig.Google.Types.Account | null;
  created: string;
  loading: boolean;
  verified: boolean;
  first_login: boolean;
  referrer_id: number | null;
  referral_code: string | null;
}
