import { PlatformType } from '@/constants';

export const EXPORT_TYPES = [
  {
    label: 'Amazon Alexa',
    value: PlatformType.ALEXA,
  },
  {
    label: 'Dialogflow ES',
    value: PlatformType.GOOGLE,
  },
  {
    label: 'Microsoft LUIS',
    value: PlatformType.GENERAL,
  },
];

export const EXPORT_HELP_LINK = 'https://docs.voiceflow.com/#/platform/interaction-model/model-manager?id=model-export';
