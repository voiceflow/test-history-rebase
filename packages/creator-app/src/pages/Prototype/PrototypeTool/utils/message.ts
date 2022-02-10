import { BaseNode, BaseRequest } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { DebugTrace, PathTrace, SpeakTrace, StreamTrace, TextTrace, VisualTrace } from '@/models';
import {
  AudioMessage,
  DebugMessage,
  MessageType,
  PathMessage,
  SpeakMessage,
  StreamMessage,
  TextMessage,
  UserMessage,
  VisualMessage,
} from '@/pages/Prototype/types';

export interface CommonProperties {
  turnID?: string;
  startTime: string;
}

export const createDebugMessage = ({ id, payload: { message } }: DebugTrace, common: CommonProperties): DebugMessage => ({
  id,
  type: MessageType.DEBUG,
  message,
  ...common,
});

export const createSpeakMessage = (
  { id, payload: { type, message, voice, src } }: SpeakTrace,
  common: CommonProperties
): SpeakMessage | AudioMessage => {
  if (type === BaseNode.Speak.TraceSpeakType.AUDIO) {
    return { id, type: MessageType.AUDIO, name: message, src, ...common };
  }
  return { id, type: MessageType.SPEAK, message, voice, src, ...common };
};

export const createStreamMessage = ({ id, payload: { src } }: StreamTrace, common: CommonProperties): StreamMessage => ({
  id,
  type: MessageType.STREAM,
  audio: src,
  ...common,
});

export const createPathMessage = (trace: PathTrace, common: CommonProperties): PathMessage => ({
  id: trace.id,
  type: MessageType.PATH,
  path: trace.payload.path,
  ...common,
});

export const createTextMessage = (trace: TextTrace, common: CommonProperties): TextMessage => ({
  id: trace.id,
  type: MessageType.TEXT,
  slate: trace.payload.slate,
  ...common,
});

export const createVisualMessage = (trace: VisualTrace, common: CommonProperties): VisualMessage | null => {
  const { payload } = trace;
  // The only time we dont render the visual message is if the visual type is of JSON
  if (payload.visualType === BaseNode.Visual.VisualType.APL && payload.aplType === BaseNode.Visual.APLType.JSON) {
    return null;
  }

  return {
    id: trace.id,
    type: MessageType.VISUAL,
    ...trace.payload,
    ...common,
  };
};

const isGuidedNavRequest = (request: BaseRequest.BaseRequest): request is BaseRequest.BaseRequest<string> =>
  !!request.type.toLowerCase().match(/^port\d+$/) && typeof request.payload === 'string';

export const createUserMessage = (request: BaseRequest.BaseRequest, common: CommonProperties, id = Utils.id.cuid()): UserMessage => {
  let input = request.type;

  if (BaseRequest.isIntentRequest(request)) {
    input = request.payload.label || request.payload.query || request.payload.intent.name;
  } else if (BaseRequest.isTextRequest(request) || isGuidedNavRequest(request)) {
    input = request.payload;
  } else if (typeof request.payload === 'object' && !!request.payload && typeof (request.payload as any).label === 'string') {
    input = (request.payload as any).label;
  }

  return {
    id,
    type: MessageType.USER,
    input,
    ...common,
  };
};
