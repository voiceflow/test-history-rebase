import * as PlatformConfig from '@voiceflow/platform-config';

import * as Models from '@/models';

export type PlatformAccount = Models.Account | PlatformConfig.Google.Types.Account | PlatformConfig.Alexa.Types.Account;
