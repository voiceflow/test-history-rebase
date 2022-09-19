import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { Dialogflow } from '@/platforms';

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

export const getPlatformPopupLayout = Utils.platform.createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: Dialogflow.Components.PlatformUploadPopupLayout,
  },
  Dialogflow.Components.PlatformUploadPopupLayout
);
