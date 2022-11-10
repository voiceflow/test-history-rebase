import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { platformAware } from '@/hocs';
import Alexa from '@/platforms/alexa/jobs/publish';
import DialogflowCX from '@/platforms/dialogflowCX/jobs/publish';
import DialogflowES from '@/platforms/dialogflowES/jobs/publish';
import General from '@/platforms/general/jobs/publish';
import Google from '@/platforms/google/jobs/publish';
import Webchat from '@/platforms/webchat/jobs/publish';

const UploadGroup = platformAware(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Alexa,
    [VoiceflowConstants.PlatformType.GOOGLE]: Google,
    [VoiceflowConstants.PlatformType.WEBCHAT]: Webchat,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_CX]: DialogflowCX,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: DialogflowES,
  },
  General
);

export default UploadGroup;
