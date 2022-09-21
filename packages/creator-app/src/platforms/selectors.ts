import { AlexaConstants } from '@voiceflow/alexa-types';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { applyAlexaIntentNameFormatting, applyLUISIntentNameFormatting } from '@/utils/intent/platform';

import alexaClient from './alexa/client';
import { UTTERANCE_RECOMMENDATIONS_LOCALES as ALEXA_UTTERANCE_RECOMMENDATIONS_LOCALES } from './alexa/constants';
import dialogflowESClient from './dialogflowES/client';
import { UTTERANCE_RECOMMENDATIONS_LOCALES as DF_ES_UTTERANCE_RECOMMENDATIONS_LOCALES } from './dialogflowES/constants';
import generalClient from './general/client';
import { UTTERANCE_RECOMMENDATIONS_LOCALES as GENERAL_UTTERANCE_RECOMMENDATIONS_LOCALES } from './general/constants';
import googleClient from './google/client';
import { UTTERANCE_RECOMMENDATIONS_LOCALES as GOOGLE_UTTERANCE_RECOMMENDATIONS_LOCALES } from './google/constants';
import { PlatformClient } from './types';

export type AnyLocale = VoiceflowConstants.Locale | AlexaConstants.Locale | GoogleConstants.Locale | DFESConstants.Locale;

export const platformClients = {
  alexa: alexaClient,
  google: googleClient,
  general: generalClient,
  dialogflowES: dialogflowESClient,
};

export const getPlatformClient = Utils.platform.createPlatformSelector<PlatformClient>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: alexaClient,
    [VoiceflowConstants.PlatformType.GOOGLE]: googleClient,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: dialogflowESClient,
  },
  generalClient
);

export const getPlatformIntentNameFormatter = Utils.platform.createPlatformSelector<(name: string) => string>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: applyAlexaIntentNameFormatting,
    [VoiceflowConstants.PlatformType.GOOGLE]: applyAlexaIntentNameFormatting,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: applyAlexaIntentNameFormatting,
  },
  applyLUISIntentNameFormatting
);

export const getUtteranceRecommendationsLocales = Utils.platform.createPlatformSelector<AnyLocale[]>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: ALEXA_UTTERANCE_RECOMMENDATIONS_LOCALES,
    [VoiceflowConstants.PlatformType.GOOGLE]: GOOGLE_UTTERANCE_RECOMMENDATIONS_LOCALES,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: DF_ES_UTTERANCE_RECOMMENDATIONS_LOCALES,
  },
  GENERAL_UTTERANCE_RECOMMENDATIONS_LOCALES
);
