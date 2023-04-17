/* eslint-disable xss/no-mixed-html */
import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import type { AnyTranscriptMessage, SpeakTrace } from '@/models';
import { FormatType } from '@/models';
import {
  createCardMessage,
  createCarouselMessage,
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

  if (type === BaseNode.Speak.TraceSpeakType.MESSAGE && message.startsWith('<audio src=')) {
    return {
      ...trace,
      payload: {
        ...trace.payload,
        type: BaseNode.Speak.TraceSpeakType.AUDIO,
        src: message.replace('<audio src="', '').replace('"/>', ''),
      },
    };
  }

  return trace;
};

const dialogAdapter = createMultiAdapter<AnyTranscriptMessage, Message | null>((transcriptMessage) => {
  const commonProperties = {
    turnID: transcriptMessage.turnID,
    startTime: transcriptMessage.startTime,
    withAnimation: true,
  };

  if (transcriptMessage.format === FormatType.Request) {
    return createUserMessage(transcriptMessage.payload, commonProperties);
  }

  if (transcriptMessage.format === FormatType.Trace) {
    const trace = { ...transcriptMessage.payload, id: Utils.id.cuid() };
    switch (trace.type) {
      case BaseNode.Utils.TraceType.SPEAK:
        return createSpeakMessage(transformSpeakTrace(trace), commonProperties);
      case BaseNode.Utils.TraceType.TEXT:
        return createTextMessage(trace, commonProperties);
      case BaseNode.Utils.TraceType.CAROUSEL:
        return createCarouselMessage(trace, commonProperties);
      case BaseNode.Utils.TraceType.STREAM:
        return createStreamMessage(trace, commonProperties);
      case BaseNode.Utils.TraceType.DEBUG:
        return createDebugMessage(trace, commonProperties);
      case BaseNode.Utils.TraceType.VISUAL:
        return createVisualMessage(trace, commonProperties);
      case BaseNode.Utils.TraceType.PATH:
        return createPathMessage(trace, commonProperties);
      case BaseNode.Utils.TraceType.CARD_V2:
        return createCardMessage(trace, commonProperties);
      default:
        return null;
    }
  }

  return null;
}, notImplementedAdapter.transformer);

export default dialogAdapter;
