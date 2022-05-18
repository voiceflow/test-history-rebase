import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { applyAlexaIntentAndSlotNameFormatting, applyLUISIntentAndSlotNameFormatting } from '@/utils/intent';

import AlexaClient from './alexa/client';
import DialogflowClient from './dialogflow/client';
import GeneralClient from './general/client';
import GoogleClient from './google/client';
import { PlatformClient } from './types';

export const platformClients = {
  alexa: AlexaClient,
  google: GoogleClient,
  dialogflow: DialogflowClient,
  general: GeneralClient,
};

export const getPlatformClient = Utils.platform.createPlatformSelector<PlatformClient>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: AlexaClient,
    [VoiceflowConstants.PlatformType.GOOGLE]: GoogleClient,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: DialogflowClient,
  },
  GeneralClient
);

export const getPlatformIntentAndSlotNameFormatter = Utils.platform.createPlatformSelector<(name: string) => string>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: applyAlexaIntentAndSlotNameFormatting,
    [VoiceflowConstants.PlatformType.GOOGLE]: applyAlexaIntentAndSlotNameFormatting,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: applyAlexaIntentAndSlotNameFormatting,
  },
  applyLUISIntentAndSlotNameFormatting
);
