import { Constants } from '@voiceflow/general-types';

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
    [Constants.PlatformType.ALEXA]: Alexa,
    [Constants.PlatformType.GOOGLE]: Google,
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: Dialogflow,
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: Dialogflow,
  },
  General
);

export const getPlatformPopupLayout = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: getAlexaPopupLayout,
    [Constants.PlatformType.GOOGLE]: getGooglePopupLayout,
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: getDialogflowPopupLayout,
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: getDialogflowPopupLayout,
  },
  getGeneralPopupLayout
);
