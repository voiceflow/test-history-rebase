import * as Common from '@platform/configs/common';
import { AlexaConstants } from '@voiceflow/alexa-types';

export interface Model extends Common.Voice.Models.Prompt.Model {
  voice?: AlexaConstants.Voice | null;
}
