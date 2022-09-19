import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { platformAware } from '@/hocs';
import Alexa from '@/platforms/alexa/jobs/publish';
import General from '@/platforms/general/jobs/publish';

import Dialogflow from './Dialogflow';
import Google from './Google';

const UploadGroup = platformAware(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Alexa,
    [VoiceflowConstants.PlatformType.GOOGLE]: Google,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: Dialogflow,
  },
  General
);

export default UploadGroup;
