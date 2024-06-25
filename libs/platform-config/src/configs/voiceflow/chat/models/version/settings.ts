import type * as Common from '@platform-config/configs/common';
import type { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';

export interface Model extends Common.Chat.Models.Version.Settings.Extends<VoiceflowVersion.ChatSettings> {
  locales: VoiceflowConstants.Locale[];
}
