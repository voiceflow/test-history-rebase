import type * as Common from '@platform-config/configs/common';
import type { Nullable } from '@voiceflow/common';
import type { DFESVersion } from '@voiceflow/google-dfes-types';
import type { GoogleConstants } from '@voiceflow/google-types';

import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export interface Session extends Common.Voice.Models.Version.Session<GoogleConstants.Voice> {}

export interface Model extends Common.Voice.Models.Version.Model {
  status: Nullable<DFESVersion.VoicePlatformData['status']>;
  session: Session;
  settings: Settings.Model;
  publishing: Publishing.Model;
}
