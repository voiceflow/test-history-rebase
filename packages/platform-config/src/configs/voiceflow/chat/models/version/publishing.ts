import * as Common from '@platform-config/configs/common';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';

export interface Model extends Common.Chat.Models.Version.Publishing.Extends<VoiceflowVersion.ChatPublishing> {}
