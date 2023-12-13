import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import {
  NLP_IMPORT_ALEXA,
  NLP_IMPORT_DIALOGFLOW_CX,
  NLP_IMPORT_DIALOGFLOW_ES,
  NLP_IMPORT_EINSTEIN,
  NLP_IMPORT_LEX_V1,
  NLP_IMPORT_LUIS,
  NLP_IMPORT_NUANCE_MIX,
  NLP_IMPORT_RASA2,
  NLP_IMPORT_RASA3,
  NLP_IMPORT_VOICEFLOW,
  NLP_IMPORT_WATSON,
} from '@/config/documentation';
import { NLPType } from '@/config/nlp/constants';

export enum ImportType {
  INTENT = 'intent',
}

export const ImportModalTitle = {
  [ImportType.INTENT]: 'Intents',
};

export const ImportLearnMoreLink: Record<NLPType, string> = {
  [NLPType.ALEXA]: NLP_IMPORT_ALEXA,
  [NLPType.LEX_V1]: NLP_IMPORT_LEX_V1,
  [NLPType.DIALOGFLOW_CX]: NLP_IMPORT_DIALOGFLOW_CX,
  [NLPType.DIALOGFLOW_ES]: NLP_IMPORT_DIALOGFLOW_ES,
  [NLPType.WATSON]: NLP_IMPORT_WATSON,
  [NLPType.LUIS]: NLP_IMPORT_LUIS,
  [NLPType.NUANCE_MIX]: NLP_IMPORT_NUANCE_MIX,
  [NLPType.RASA2]: NLP_IMPORT_RASA2,
  [NLPType.RASA3]: NLP_IMPORT_RASA3,
  [NLPType.EINSTEIN]: NLP_IMPORT_EINSTEIN,
  [NLPType.VOICEFLOW]: NLP_IMPORT_VOICEFLOW,
};

export const getDropzoneCaption = (platformName: string, fileExtensions: string) =>
  Utils.platform.createPlatformSelector<string>(
    {
      [VoiceflowConstants.PlatformType.VOICEFLOW]: 'Imports must be in CSV format. ',
    },
    `${platformName} imports must be ${fileExtensions}. `
  );
