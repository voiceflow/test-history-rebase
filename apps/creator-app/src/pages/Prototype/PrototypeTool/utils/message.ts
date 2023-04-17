import { BaseNode, BaseRequest } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';

import type {
  CardV2Trace,
  CarouselTrace,
  ChannelActionTrace,
  DebugTrace,
  PathTrace,
  SpeakTrace,
  StreamTrace,
  TextTrace,
  VisualTrace,
} from '@/models';
import type {
  AudioMessage,
  CardMessage,
  CarouselMessage,
  ChannelActionMessage,
  DebugMessage,
  PathMessage,
  SpeakMessage,
  StreamMessage,
  TextMessage,
  UserMessage,
  VisualMessage,
} from '@/pages/Prototype/types';
import { MessageType } from '@/pages/Prototype/types';

export const VF_ELICIT = 'ELICIT';

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
  { id, payload: { type, message, voice, src, ai } }: SpeakTrace,
  common: CommonProperties
): SpeakMessage | AudioMessage => {
  if (type === BaseNode.Speak.TraceSpeakType.AUDIO) {
    return { id, type: MessageType.AUDIO, name: message, src, ai, ...common };
  }
  return { id, type: MessageType.SPEAK, message, voice, src, ai, ...common };
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
  ai: trace.payload.ai,
  ...common,
});

export const createCarouselMessage = (trace: CarouselTrace, common: CommonProperties): CarouselMessage => ({
  id: trace.id,
  type: MessageType.CAROUSEL,
  cards: trace.payload.cards,
  layout: trace.payload.layout,
  ...common,
});

export const createCardMessage = (trace: CardV2Trace, common: CommonProperties): CardMessage => {
  return {
    id: trace.id,
    type: MessageType.CARD,
    title: trace.payload.title,
    description: trace.payload.description,
    imageUrl: trace.payload.imageUrl,
    buttons: trace.payload.buttons,
    ...common,
  };
};

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

export const createChannelActionMessage = (trace: ChannelActionTrace, common: CommonProperties): ChannelActionMessage => ({
  id: trace.id,
  type: MessageType.CHANNEL_ACTION,
  name: trace.payload.name,
  ...common,
});

const isGuidedNavRequest = (request: BaseRequest.BaseRequest): request is BaseRequest.BaseRequest<string> =>
  !!request.type.toLowerCase().match(/^port\d+$/) && typeof request.payload === 'string';

export const createUserMessage = (
  request: BaseRequest.BaseRequest & { [VF_ELICIT]?: boolean },
  common: CommonProperties,
  id = Utils.id.cuid()
): Nullable<UserMessage> => {
  if (request[VF_ELICIT]) return null;

  let input = request.type;
  let additionalData = {};
  if (BaseRequest.isIntentRequest(request)) {
    input = request.payload.label || request.payload.query || request.payload.intent.name;
    additionalData = { confidence: request.payload.confidence };
  } else if (BaseRequest.isTextRequest(request) || isGuidedNavRequest(request)) {
    input = request.payload;
  } else if (
    Utils.object.isObject(request.payload) &&
    Utils.object.hasProperty(request.payload, 'label') &&
    typeof request.payload.label === 'string'
  ) {
    input = request.payload.label;
  }

  return {
    id,
    type: MessageType.USER,
    input,
    ...additionalData,
    ...common,
  };
};
