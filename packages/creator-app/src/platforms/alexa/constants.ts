export const ALEXA_LEARN_MORE_URL = 'https://www.voiceflow.com/tutorials/uploading-and-testing-on-your-alexa-device';

export const ALEXA_SIMULATOR_URL = (amazonID: string, locale: string): string =>
  `https://developer.amazon.com/alexa/console/ask/test/${amazonID}/development/${locale}/`;
