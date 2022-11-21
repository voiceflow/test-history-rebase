import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';

import { applyAlexaIntentNameFormatting, applyLUISIntentNameFormatting } from '@/utils/intent/platform';

import alexaClient from './alexa/client';
import { UTTERANCE_RECOMMENDATIONS_LOCALES as ALEXA_UTTERANCE_RECOMMENDATIONS_LOCALES } from './alexa/constants';
import dialogflowCXClient from './dialogflowCX/client';
import dialogflowESClient from './dialogflowES/client';
import { UTTERANCE_RECOMMENDATIONS_LOCALES as DF_ES_UTTERANCE_RECOMMENDATIONS_LOCALES } from './dialogflowES/constants';
import generalClient from './general/client';
import { UTTERANCE_RECOMMENDATIONS_LOCALES as GENERAL_UTTERANCE_RECOMMENDATIONS_LOCALES } from './general/constants';
import googleClient from './google/client';
import { UTTERANCE_RECOMMENDATIONS_LOCALES as GOOGLE_UTTERANCE_RECOMMENDATIONS_LOCALES } from './google/constants';
import { PlatformClient } from './types';

export const platformClients = {
  alexa: alexaClient,
  google: googleClient,
  general: generalClient,
  dialogflowES: dialogflowESClient,
  dialogflowCX: dialogflowCXClient,
};

export const getPlatformClient = Utils.platform.createPlatformSelector<PlatformClient>(
  {
    [Platform.Constants.PlatformType.ALEXA]: alexaClient,
    [Platform.Constants.PlatformType.GOOGLE]: googleClient,
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: dialogflowESClient,
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
  applyLUISIntentNameFormatting
);

export const getUtteranceRecommendationsLocales = Utils.platform.createPlatformSelector<string[]>(
  {
    [Platform.Constants.PlatformType.ALEXA]: ALEXA_UTTERANCE_RECOMMENDATIONS_LOCALES,
    [Platform.Constants.PlatformType.GOOGLE]: GOOGLE_UTTERANCE_RECOMMENDATIONS_LOCALES,
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: DF_ES_UTTERANCE_RECOMMENDATIONS_LOCALES,
  },
  GENERAL_UTTERANCE_RECOMMENDATIONS_LOCALES
);
