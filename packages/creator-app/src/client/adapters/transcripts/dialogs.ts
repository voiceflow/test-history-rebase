import cuid from 'cuid';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { MessageType } from '@/pages/Prototype/types';

const dialogAdapter = createAdapter<any, any>(
  (data) => {
    const responseType = data.format;
    const isUserInput = responseType === 'request';
    const nestedPayload = data.payload?.payload;
    let specificProperties = {};

    const commonProperties = {
      startTime: data.timestamp,
      timestamp: data.timestamp,
      sessionID: data.session_id,
      turnID: data.turn_id,
      id: cuid(),
    };

    // eslint-disable-next-line xss/no-mixed-html
    const isAudioSpeak = data.payload.type === 'speak' && nestedPayload?.message.includes('<audio src=');
    if (isAudioSpeak) {
      const { message } = nestedPayload;
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
          input: nestedPayload?.query,
          intentName: nestedPayload?.intent?.name,
          ...commonProperties,
        }
      : {
          ...nestedPayload,
          image: nestedPayload?.image || nestedPayload?.imageURL,
          type: data.type.toUpperCase(),
          intentConfidence: data.state?.variables?.intent_confidence,
          intentName: nestedPayload?.intent?.name,
          ...commonProperties,
          ...specificProperties,
        };
  },

  () => {
    throw new AdapterNotImplementedError();
  }
);

export default dialogAdapter;
