import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformLabel = Utils.platform.createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Alexa',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google Actions',
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow',
  },
  'General Assistant'
);
