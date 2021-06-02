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
