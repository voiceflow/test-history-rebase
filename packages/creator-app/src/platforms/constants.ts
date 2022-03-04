import Alexa from './alexa';
import Dialogflow from './dialogflow';
import General from './general';
import Google from './google';

// eslint-disable-next-line import/prefer-default-export
export const platformClients = {
  alexa: Alexa.client,
  google: Google.client,
  dialogflow: Dialogflow.client,
  general: General.client,
};
