import type * as Common from '@platform-config/configs/common';
import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export interface Session extends Common.Voice.Models.Version.Session<VoiceflowConstants.Voice> {}

export interface Model extends Common.Voice.Models.Version.Model {
  status: null;
  session: Session;
  settings: Settings.Model;
  publishing: Publishing.Model;
}
