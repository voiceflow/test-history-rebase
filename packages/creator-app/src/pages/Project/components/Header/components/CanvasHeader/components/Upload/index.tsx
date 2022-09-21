import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { platformAware } from '@/hocs';
import Alexa from '@/platforms/alexa/jobs/publish';
import DialogflowES from '@/platforms/dialogflowES/jobs/publish';
import General from '@/platforms/general/jobs/publish';
import Google from '@/platforms/google/jobs/publish';

const UploadGroup = platformAware(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Alexa,
    [VoiceflowConstants.PlatformType.GOOGLE]: Google,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: DialogflowES,
  },
  General
);

export default UploadGroup;
