import * as Common from '@platform-config/configs/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const smart = Common.Voice.Adapters.Intent.smartFactory<VoiceflowConstants.Voice>();

export const simple = Common.Voice.Adapters.Intent.simpleFactory<VoiceflowConstants.Voice>();
