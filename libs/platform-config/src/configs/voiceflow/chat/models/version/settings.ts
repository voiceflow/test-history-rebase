import type { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';

import type * as Common from '@/configs/common';

export interface Model extends Common.Chat.Models.Version.Settings.Extends<VoiceflowVersion.ChatSettings> {
  locales: VoiceflowConstants.Locale[];
}
