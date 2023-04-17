import * as Common from '@platform-config/configs/common';
import { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';

export interface Model extends Common.Voice.Models.Version.Settings.Extends<VoiceflowVersion.VoiceSettings, VoiceflowConstants.Voice> {
  locales: VoiceflowConstants.Locale[];
}
