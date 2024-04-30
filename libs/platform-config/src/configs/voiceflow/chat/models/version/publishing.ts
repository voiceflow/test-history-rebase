import type { VoiceflowVersion } from '@voiceflow/voiceflow-types';

import type * as Common from '@/configs/common';

export interface Model extends Common.Chat.Models.Version.Publishing.Extends<VoiceflowVersion.ChatPublishing> {}
