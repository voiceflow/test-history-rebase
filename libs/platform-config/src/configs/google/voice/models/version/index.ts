import type { Nullable } from '@voiceflow/common';
import type { GoogleConstants, GoogleVersion } from '@voiceflow/google-types';

import type * as Common from '@/configs/common';

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
