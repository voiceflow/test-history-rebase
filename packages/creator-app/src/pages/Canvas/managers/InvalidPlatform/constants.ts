import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const getPlatformLabel = Utils.platform.createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Alexa',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google Actions',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow',
  },
  'General Assistant'
);
