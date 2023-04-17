import * as Common from '@platform-config/configs/common';
import { Nullable } from '@voiceflow/common';
import { GoogleConstants, GoogleVersion } from '@voiceflow/google-types';

import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export interface Session extends Common.Voice.Models.Version.Session<GoogleConstants.Voice> {}

export interface Model extends Common.Voice.Models.Version.Model {
  status: Nullable<GoogleVersion.VoicePlatformData['status']>;
  session: Session;
  settings: Settings.Model;
  publishing: Publishing.Model;
}
