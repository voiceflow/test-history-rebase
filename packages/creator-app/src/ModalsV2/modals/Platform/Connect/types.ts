import { Nullable } from '@voiceflow/common';

import * as Models from '@/models';

export type PlatformAccount = Nullable<Models.Account> | Models.Account.Google | Models.Account.Amazon;
