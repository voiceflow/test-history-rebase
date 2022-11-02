import * as Common from '@platform/configs/common';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { VoiceModels } from '@voiceflow/voice-types';
import { SimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../models';

export const simple = Common.Voice.Adapters.Prompt.simple as SimpleAdapter<
  VoiceModels.Prompt<AlexaConstants.Voice>,
  Models.Prompt.Model,
  Common.Voice.Adapters.Intent.FromDBOptions,
  Common.Voice.Adapters.Intent.ToDBOptions
>;
