import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import type * as Common from '@/configs/common';

export interface Model extends Common.Voice.Models.Intent.Model<VoiceflowConstants.Voice> {}
