import type * as Common from '@platform-config/configs/common';
import type { VoiceflowVersion } from '@voiceflow/voiceflow-types';

export interface Model extends Common.Chat.Models.Version.Publishing.Extends<VoiceflowVersion.ChatPublishing> {}
