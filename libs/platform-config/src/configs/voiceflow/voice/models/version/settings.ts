import type { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';

import type * as Common from '@/configs/common';

export interface Model
  extends Common.Voice.Models.Version.Settings.Extends<VoiceflowVersion.VoiceSettings, VoiceflowConstants.Voice> {
  locales: VoiceflowConstants.Locale[];
}
