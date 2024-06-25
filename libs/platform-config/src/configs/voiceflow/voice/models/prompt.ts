import type * as Common from '@platform-config/configs/common';
import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export interface Model extends Common.Voice.Models.Prompt.Model<VoiceflowConstants.Voice> {}
