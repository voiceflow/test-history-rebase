import type * as Common from '@platform-config/configs/common';
import type { AlexaConstants } from '@voiceflow/alexa-types';

export interface Model extends Common.Voice.Models.Intent.Model<AlexaConstants.Voice> {}
