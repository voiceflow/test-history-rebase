import { Utils } from '@voiceflow/common';
import type * as PlatformConfig from '@voiceflow/platform-config';

import type { AccountState } from './types';

const accountType = Utils.protocol.typeFactory('account');

export const resetAccount = Utils.protocol.createAction(accountType('RESET'));

export const updateAccount = Utils.protocol.createAction<Partial<AccountState>>(accountType('UPDATE'));

export const updateAmazonAccount = Utils.protocol.createAction<Partial<PlatformConfig.Alexa.Types.Account>>(
  accountType('amazon.UPDATE')
);

export const updateGoogleAccount = Utils.protocol.createAction<PlatformConfig.Google.Types.Account>(
  accountType('google.UPDATE')
);
