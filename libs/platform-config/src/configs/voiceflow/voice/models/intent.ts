import * as Common from '@platform-config/configs/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export interface Model extends Common.Voice.Models.Intent.Model<VoiceflowConstants.Voice> {}
