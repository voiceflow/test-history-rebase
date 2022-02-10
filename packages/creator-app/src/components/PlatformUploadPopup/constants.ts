import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from '@/utils/platform';

import Alexa, { getAlexaPopupLayout } from './Alexa';
import Dialogflow, { getDialogflowPopupLayout } from './Dialogflow';
import General, { getGeneralPopupLayout } from './General';
import Google, { getGooglePopupLayout } from './Google';

export interface Project {
  id: string;
  name: string;
}

export interface PlatformContentProps {
  export?: boolean;
  loader?: boolean;
  setMultiProjects?: (value: boolean) => void;
  createNewAgent?: () => void;
}

export const getPlatformContent = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Alexa,
    [VoiceflowConstants.PlatformType.GOOGLE]: Google,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: Dialogflow,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: Dialogflow,
  },
  General
);

export const getPlatformPopupLayout = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: getAlexaPopupLayout,
    [VoiceflowConstants.PlatformType.GOOGLE]: getGooglePopupLayout,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: getDialogflowPopupLayout,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_VOICE]: getDialogflowPopupLayout,
  },
  getGeneralPopupLayout
);
