import cuid from 'cuid';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { MessageType } from '@/pages/Prototype/types';

const dialogAdapter = createAdapter<any, any>(
  (data) => {
    const responseType = data.format;
    const isUserInput = responseType === 'request';
    let specificProperties = {};

    const commonProperties = {
      startTime: data.timestamp,
      timestamp: data.timestamp,
      sessionID: data.session_id,
      turnID: data.turn_id,
      id: cuid(),
    };

    // eslint-disable-next-line xss/no-mixed-html
    const isAudioSpeak = data.payload.type === 'speak' && data.payload.payload.message.includes('<audio src=');
    if (isAudioSpeak) {
      const { message } = data.payload.payload;
      // eslint-disable-next-line xss/no-mixed-html
      const extractedURL = message.replace('<audio src="', '').replace('"/>', '');
      specificProperties = {
        type: MessageType.AUDIO,
        src: extractedURL,
      };
    }

    return isUserInput
      ? {
          type: MessageType.USER,
          input: data.payload.payload?.query,
          intentName: data.payload?.payload?.intent?.name,
          ...commonProperties,
        }
      : {
          ...data.payload?.payload,
          image: data.payload.payload?.image,
          type: data.type.toUpperCase(),
          intentConfidence: data.state?.variables?.intent_confidence,
          intentName: data.payload?.payload?.intent?.name,
          ...commonProperties,
          ...specificProperties,
        };
  },

  () => {
    throw new AdapterNotImplementedError();
  }
);

export default dialogAdapter;
