import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';

import { applyAlexaIntentNameFormatting, applyVFNLUIntentNameFormatting } from '@/utils/intent/platform';

import alexaClient from './alexa/client';
import dialogflowCXClient from './dialogflowCX/client';
import generalClient from './general/client';
import smsClient from './sms/client';
import type { PlatformClient } from './types';
import whatsappClient from './whatsapp/client';

export const platformClients = {
  alexa: alexaClient,
  general: generalClient,
  whatsapp: whatsappClient,
  sms: smsClient,
  dialogflowCX: dialogflowCXClient,
};

export const getPlatformClient = Utils.platform.createPlatformSelector<PlatformClient>(
  {
    [Platform.Constants.PlatformType.ALEXA]: alexaClient,
    [Platform.Constants.PlatformType.DIALOGFLOW_CX]: dialogflowCXClient,
  },
  generalClient
);

export const getPlatformIntentNameFormatter = Utils.platform.createPlatformSelector<(name: string) => string>(
  {
    [Platform.Constants.PlatformType.ALEXA]: applyAlexaIntentNameFormatting,
    [Platform.Constants.PlatformType.GOOGLE]: applyAlexaIntentNameFormatting,
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: applyAlexaIntentNameFormatting,
  },
  applyVFNLUIntentNameFormatting
);
