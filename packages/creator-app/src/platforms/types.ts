import Alexa from './alexa';
import Dialogflow from './dialogflow';
import General from './general';
import Google from './google';

export type PlatformClient = typeof Alexa.client | typeof Google.client | typeof Dialogflow.client | typeof General.client;
