import * as Common from '@platform-config/configs/common';
import { AlexaConstants, AlexaVersion } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';

import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export interface Session extends Common.Voice.Models.Version.Session<AlexaConstants.Voice> {}

export interface Model extends Common.Voice.Models.Version.Model {
  status: Nullable<AlexaVersion.PlatformData['status']>;
  session: Session;
  settings: Settings.Model;
  publishing: Publishing.Model;
}
