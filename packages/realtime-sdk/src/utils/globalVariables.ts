import { BUILT_IN_VARIABLES, BuiltInVariable } from '@realtime-sdk/constants';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from './platform';

export const getPlatformGlobalVariables = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.GOOGLE]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [VoiceflowConstants.PlatformType.VOICEFLOW]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: [...BUILT_IN_VARIABLES, BuiltInVariable.CHANNEL],
  },
  BUILT_IN_VARIABLES
);
