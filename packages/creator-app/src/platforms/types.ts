import * as Alexa from './alexa';
import * as Dialogflow from './dialogflow';
import * as General from './general';
import * as Google from './google';

export type PlatformClient = typeof Alexa.client | typeof Google.client | typeof Dialogflow.client | typeof General.client;
