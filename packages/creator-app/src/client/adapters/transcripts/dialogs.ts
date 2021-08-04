import moment from 'moment';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { MessageType } from '@/pages/Prototype/types';

const dialogAdapter = createAdapter<any, any>(
  (data) => {
    const responseType = data.format;
    const isUserInput = responseType === 'request';
    let specificProperties = {};

    const commonProperties = {
      startTime: moment.utc(data.timestamp).format('mm:ss'),
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
          ...commonProperties,
        }
      : {
          ...data.payload?.payload,
          image: data.payload.payload?.image,
          type: data.type.toUpperCase(),
          ...commonProperties,
          ...specificProperties,
        };
  },

  () => {
    throw new AdapterNotImplementedError();
  }
);

export default dialogAdapter;
