import { BUILT_IN_VARIABLES, BuiltInVariable } from '@realtime-sdk/constants';
import * as Platform from '@voiceflow/platform-config';

import { createPlatformSelector } from './platform';

export const getPlatformGlobalVariables = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.GOOGLE]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [Platform.Constants.PlatformType.VOICEFLOW]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: [...BUILT_IN_VARIABLES, BuiltInVariable.CHANNEL],
  },
  BUILT_IN_VARIABLES
);
