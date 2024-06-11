import * as PlatformConfig from '@voiceflow/platform-config';

import { Membership } from '@/permissions/permissions.types';

export interface AccountState {
  creator_id: number | null;
  name: string | null;
  email: string | null;
  image: string | null;
  amazon: PlatformConfig.Alexa.Types.Account | null;
  google: PlatformConfig.Google.Types.Account | null;
  created: string;
  loading: boolean;
  verified: boolean;
  first_login: boolean;
  roles: Membership[];
}
