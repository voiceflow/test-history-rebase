import { PlatformType } from '@voiceflow/internal';

import { BUILT_IN_VARIABLES, BuiltInVariable } from '@/constants/index';
import { createPlatformSelector } from '@/utils/platform';

export const getPlatformGlobalVariables = createPlatformSelector(
  {
    [PlatformType.GOOGLE]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [PlatformType.GENERAL]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
  },
  BUILT_IN_VARIABLES
);
