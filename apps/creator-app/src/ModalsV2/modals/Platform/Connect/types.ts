import type * as PlatformConfig from '@voiceflow/platform-config';

import type * as Models from '@/models';

export type PlatformAccount = Models.Account | PlatformConfig.Google.Types.Account | PlatformConfig.Alexa.Types.Account;
