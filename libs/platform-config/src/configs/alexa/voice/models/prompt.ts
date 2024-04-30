import type { AlexaConstants } from '@voiceflow/alexa-types';

import type * as Common from '@/configs/common';

export interface Model extends Common.Voice.Models.Prompt.Model<AlexaConstants.Voice> {}
