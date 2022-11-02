import * as Common from '@platform/configs/common';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { VoiceModels } from '@voiceflow/voice-types';
import { SimpleAdapter, SmartMultiAdapter } from 'bidirectional-adapter';

import * as Models from '../models';

export const smart = Common.Voice.Adapters.Intent.smart as SmartMultiAdapter<
  VoiceModels.Intent<AlexaConstants.Voice>,
  Models.Intent.Model,
  Common.Voice.Adapters.Intent.FromDBOptions,
  Common.Voice.Adapters.Intent.ToDBOptions,
  Common.Voice.Adapters.Intent.KeyRemap
>;

export const simple = Common.Voice.Adapters.Intent.simple as SimpleAdapter<
  VoiceModels.Intent<AlexaConstants.Voice>,
  Models.Intent.Model,
  Common.Voice.Adapters.Intent.FromDBOptions,
  Common.Voice.Adapters.Intent.ToDBOptions
>;
