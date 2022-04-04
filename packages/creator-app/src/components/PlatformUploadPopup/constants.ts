import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

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

export const getPlatformContent = Utils.platform.createPlatformSelectorV2(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Alexa,
    [VoiceflowConstants.PlatformType.GOOGLE]: Google,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: Dialogflow,
  },
  General
);

export const getPlatformPopupLayout = Utils.platform.createPlatformSelectorV2(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: getAlexaPopupLayout,
    [VoiceflowConstants.PlatformType.GOOGLE]: getGooglePopupLayout,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: getDialogflowPopupLayout,
  },
  getGeneralPopupLayout
);
