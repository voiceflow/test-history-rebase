import * as Platform from '@voiceflow/platform-config';

import { platformAware } from '@/hocs/platformAware';
import Alexa from '@/platforms/alexa/jobs/publish';
import DialogflowES from '@/platforms/dialogflowES/jobs/publish';
import General from '@/platforms/general/jobs/publish';
import Google from '@/platforms/google/jobs/publish';
import MSTeams from '@/platforms/ms-teams/jobs/publish';
import SMS from '@/platforms/sms/jobs/publish';
import Webchat from '@/platforms/webchat/jobs/publish';
import WhatsApp from '@/platforms/whatsapp/jobs/publish';

const UploadGroup = platformAware(
  {
    [Platform.Constants.PlatformType.ALEXA]: Alexa,
    [Platform.Constants.PlatformType.GOOGLE]: Google,
    [Platform.Constants.PlatformType.WEBCHAT]: Webchat,
    [Platform.Constants.PlatformType.SMS]: SMS,
    [Platform.Constants.PlatformType.WHATSAPP]: WhatsApp,
    [Platform.Constants.PlatformType.MICROSOFT_TEAMS]: MSTeams,
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: DialogflowES,
  },
  General
);

export default UploadGroup;
