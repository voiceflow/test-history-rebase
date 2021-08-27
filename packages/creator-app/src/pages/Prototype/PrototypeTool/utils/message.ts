import { Node, Request } from '@voiceflow/base-types';
import cuid from 'cuid';

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
  if (type === Node.Speak.TraceSpeakType.AUDIO) {
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
  if (trace.payload.visualType !== Node.Visual.VisualType.IMAGE || !trace.payload.image) {
    return null;
  }

  return {
    id: trace.id,
    type: MessageType.VISUAL,
    ...trace.payload,
    ...common,
  };
};

export const createUserMessage = (request: Request.BaseRequest, common: CommonProperties, id = cuid()): UserMessage => {
  let input = request.type;

  if (Request.isIntentRequest(request)) {
    input = request.payload.query || request.payload.intent.name;
  }
  if (Request.isTextRequest(request)) {
    input = request.payload;
  }

  return {
    id,
    type: MessageType.USER,
    input,
    ...common,
  };
};
