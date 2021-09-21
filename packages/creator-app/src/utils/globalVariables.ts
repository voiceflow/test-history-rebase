import { Constants } from '@voiceflow/general-types';

import { BUILT_IN_VARIABLES, BuiltInVariable } from '@/constants/index';
import { createPlatformSelector } from '@/utils/platform';

export const getPlatformGlobalVariables = createPlatformSelector(
  {
    [Constants.PlatformType.GOOGLE]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [Constants.PlatformType.GENERAL]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [Constants.PlatformType.CHATBOT]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
  },
  BUILT_IN_VARIABLES
);
