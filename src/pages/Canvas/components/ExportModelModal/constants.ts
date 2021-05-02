import { NLPProvider } from '@/constants';

export const EXPORT_TYPES = [
  {
    label: 'Amazon Alexa',
    value: NLPProvider.ALEXA,
  },
  {
    label: 'Dialogflow ES',
    value: NLPProvider.DIALOGFLOW_ES,
  },
  {
    label: 'Microsoft LUIS',
    value: NLPProvider.LUIS,
  },
  {
    label: 'Rasa',
    value: NLPProvider.RASA,
  },
];

export const EXPORT_HELP_LINK = 'https://docs.voiceflow.com/#/platform/interaction-model/model-manager?id=model-export';
