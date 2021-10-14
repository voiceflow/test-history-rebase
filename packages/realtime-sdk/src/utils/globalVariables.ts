import { Constants } from '@voiceflow/general-types';

import { BUILT_IN_VARIABLES, BuiltInVariable } from '../constants';
import { createPlatformSelector } from './platform';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformGlobalVariables = createPlatformSelector(
  {
    [Constants.PlatformType.GOOGLE]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [Constants.PlatformType.GENERAL]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [Constants.PlatformType.CHATBOT]: [...BUILT_IN_VARIABLES, BuiltInVariable.LAST_UTTERANCE],
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: [...BUILT_IN_VARIABLES, BuiltInVariable.CHANNEL],
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: [...BUILT_IN_VARIABLES, BuiltInVariable.CHANNEL],
  },
  BUILT_IN_VARIABLES
);
