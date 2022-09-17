import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { Dialogflow, General, Google } from '@/platforms';

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

export const getPlatformContent = Utils.platform.createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.GOOGLE]: Google.Components.PlatformUploadPopup,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: Dialogflow.Components.PlatformUploadPopup,
  },
  General.Components.PlatformUploadPopup
);

export const getPlatformPopupLayout = Utils.platform.createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.GOOGLE]: Google.Components.PlatformUploadPopupLayout,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: Dialogflow.Components.PlatformUploadPopupLayout,
  },
  General.Components.PlatformUploadPopupLayout
);
