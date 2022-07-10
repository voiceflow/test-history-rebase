import { AlexaConstants } from '@voiceflow/alexa-types';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { applyAlexaIntentNameFormatting, applyLUISIntentNameFormatting } from '@/utils/intent';

import * as Alexa from './alexa';
import * as Dialogflow from './dialogflow';
import * as General from './general';
import * as Google from './google';
import { PlatformClient } from './types';

export type AnyLocale = VoiceflowConstants.Locale | AlexaConstants.Locale | GoogleConstants.Locale | DFESConstants.Locale;

export const platformClients = {
  alexa: Alexa.client,
  google: Google.client,
  general: General.client,
  dialogflow: Dialogflow.client,
};

export const getPlatformClient = Utils.platform.createPlatformSelector<PlatformClient>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Alexa.client,
    [VoiceflowConstants.PlatformType.GOOGLE]: Google.client,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: Dialogflow.client,
  },
  General.client
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
    [VoiceflowConstants.PlatformType.ALEXA]: Alexa.Constants.UTTERANCE_RECOMMENDATIONS_LOCALES,
    [VoiceflowConstants.PlatformType.GOOGLE]: Google.Constants.UTTERANCE_RECOMMENDATIONS_LOCALES,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: Dialogflow.Constants.UTTERANCE_RECOMMENDATIONS_LOCALES,
  },
  General.Constants.UTTERANCE_RECOMMENDATIONS_LOCALES
);
