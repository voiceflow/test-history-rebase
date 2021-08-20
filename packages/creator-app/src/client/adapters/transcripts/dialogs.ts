import cuid from 'cuid';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { Message, MessageType } from '@/pages/Prototype/types';

export type DialogMessage = Message & {
  type: string;
  image?: string;
  intentName?: string;
  startTime: string;
  timestamp: number;
  turnID: string;
  id: string;
  src?: string;
  reprompt: boolean;
  aplType?: string;
};

const dialogAdapter = createAdapter<any, DialogMessage>(
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
      reprompt: data.payload?.payload?.path?.toLowerCase() === 'reprompt',
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
