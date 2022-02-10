import { BUILT_IN_VARIABLES, BuiltInVariable } from '@realtime-sdk/constants';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from './platform';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformGlobalVariables = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.GOOGLE]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [VoiceflowConstants.PlatformType.GENERAL]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [VoiceflowConstants.PlatformType.CHATBOT]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: [...BUILT_IN_VARIABLES, BuiltInVariable.CHANNEL],
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: [...BUILT_IN_VARIABLES, BuiltInVariable.CHANNEL],
  },
  BUILT_IN_VARIABLES
);
