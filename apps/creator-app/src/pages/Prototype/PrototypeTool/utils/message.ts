import { BaseNode } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';
import { BaseRequest } from '@voiceflow/dtos';
import { isIntentRequest, isTextRequest } from '@voiceflow/utils-designer';

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
  SessionMessage,
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
  { id, payload: { type, message, voice, src, ai, ...payload } }: SpeakTrace,
  common: CommonProperties
): SpeakMessage | AudioMessage => {
  if (type === BaseNode.Speak.TraceSpeakType.AUDIO) {
    return { id, type: MessageType.AUDIO, name: message, src, ai, ...common };
  }
  return { id, type: MessageType.SPEAK, message, voice, src, ai, knowledgeBase: (payload as any).knowledgeBase, ...common };
};

export const createSessionMessage = (
  { id = Utils.id.cuid(), message }: { id?: string; message: string },
  common: CommonProperties
): SessionMessage => ({
  id,
  type: MessageType.SESSION,
  message,
  ...common,
});

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
  slate: (trace as { payload: { slate?: TextTrace['payload']['slate'] } }).payload.slate ?? {
    id: 'dummy',
    content: [
      {
        children: [{ text: trace.payload.message }],
      },
    ],
  },
  ai: trace.payload.ai,
  knowledgeBase: (trace.payload as any).knowledgeBase,
  ...common,
});

export const isValidCard = (card: BaseNode.Carousel.TraceCarouselCard): boolean => {
  return !!card.title || !!card.description.text || !!card.imageUrl || !!card.buttons.length;
};

export const createCarouselMessage = (trace: CarouselTrace, common: CommonProperties): CarouselMessage | null => {
  const cards = trace.payload.cards
    ?.map(({ buttons, ...card }) => ({ buttons: buttons.filter((button) => button.name), ...card }))
    .filter(isValidCard);

  if (!cards?.length) {
    return null;
  }

  return {
    id: trace.id,
    type: MessageType.CAROUSEL,
    cards,
    layout: trace.payload.layout,
    ...common,
  };
};

export const createCardMessage = (trace: CardV2Trace, common: CommonProperties): CardMessage | null => {
  const card: BaseNode.Carousel.TraceCarouselCard = {
    id: trace.id,
    title: trace.payload.title,
    description: trace.payload.description,
    imageUrl: trace.payload.imageUrl,
    buttons: trace.payload.buttons?.filter((button) => !!button.name),
  };

  if (!isValidCard(card)) {
    return null;
  }

  return {
    type: MessageType.CARD,
    ...card,
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

const isGuidedNavRequest = (request: BaseRequest): request is Omit<BaseRequest, 'payload'> & { payload: string } =>
  !!request.type.toLowerCase().match(/^port\d+$/) && typeof request.payload === 'string';

export const createUserMessage = (
  request: BaseRequest & { [VF_ELICIT]?: boolean },
  common: CommonProperties,
  id = Utils.id.cuid()
): Nullable<UserMessage> => {
  if (request[VF_ELICIT]) return null;

  let input = request.type;
  let additionalData = {};
  if (isIntentRequest(request)) {
    input = request.payload.label || request.payload.query || request.payload.intent.name;
    additionalData = { confidence: request.payload.confidence };
  } else if (isTextRequest(request) || isGuidedNavRequest(request)) {
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
