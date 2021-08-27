/* eslint-disable xss/no-mixed-html */
import { Node } from '@voiceflow/base-types';
import cuid from 'cuid';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { AnyTranscriptMessage, FormatType, SpeakTrace } from '@/models';
import {
  createDebugMessage,
  createPathMessage,
  createSpeakMessage,
  createStreamMessage,
  createTextMessage,
  createUserMessage,
  createVisualMessage,
} from '@/pages/Prototype/PrototypeTool/utils/message';
import { Message } from '@/pages/Prototype/types';

const transformSpeakTrace = (trace: SpeakTrace): SpeakTrace => {
  const {
    payload: { type, message },
  } = trace;

  if (type === Node.Speak.TraceSpeakType.MESSAGE && message.startsWith('<audio src=')) {
    return {
      ...trace,
      payload: {
        ...trace.payload,
        type: Node.Speak.TraceSpeakType.AUDIO,
        src: message.replace('<audio src="', '').replace('"/>', ''),
      },
    };
  }

  return trace;
};

const dialogAdapter = createAdapter<AnyTranscriptMessage, Message | null>(
  (transcriptMessage) => {
    const commonProperties = {
      turnID: transcriptMessage.turn_id,
      startTime: transcriptMessage.timestamp,
    };

    if (transcriptMessage.format === FormatType.Request) {
      return createUserMessage(transcriptMessage.payload, commonProperties);
    }

    if (transcriptMessage.format === FormatType.Trace) {
      const trace = { ...transcriptMessage.payload, id: cuid() };
      switch (trace.type) {
        case Node.Utils.TraceType.SPEAK:
          return createSpeakMessage(transformSpeakTrace(trace), commonProperties);
        case Node.Utils.TraceType.TEXT:
          return createTextMessage(trace, commonProperties);
        case Node.Utils.TraceType.STREAM:
          return createStreamMessage(trace, commonProperties);
        case Node.Utils.TraceType.DEBUG:
          return createDebugMessage(trace, commonProperties);
        case Node.Utils.TraceType.VISUAL:
          return createVisualMessage(trace, commonProperties);
        case Node.Utils.TraceType.PATH:
          return createPathMessage(trace, commonProperties);
        default:
          return null;
      }
    }

    return null;
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default dialogAdapter;
