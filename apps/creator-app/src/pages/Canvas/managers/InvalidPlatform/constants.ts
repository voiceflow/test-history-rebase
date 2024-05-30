import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';

export const getPlatformLabel = Utils.platform.createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: 'Alexa',
    [Platform.Constants.PlatformType.GOOGLE]: 'Google Actions',
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: 'Dialogflow',
  },
  'General Agent'
);
