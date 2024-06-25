import { BaseRequest } from '@voiceflow/base-types';

import type { Interaction, Message } from '@/pages/Prototype/types';
import { BotMessageTypes, MessageType } from '@/pages/Prototype/types';
import { openURLInANewTab } from '@/utils/window';

export const checkIfFirstInGroup = (previousMessage: Message, currentMessage: Message) => {
  return BotMessageTypes.includes(previousMessage?.type) !== BotMessageTypes.includes(currentMessage?.type);
};

export const checkIfLastInGroup = (messageIndex: number, messages: Message[]) => {
  let pointer = messageIndex + 1;
  while (pointer < messages.length) {
    const curr = messages[pointer];
    if (BotMessageTypes.includes(curr?.type)) return false;
    if (curr.type === MessageType.USER) return true;
    pointer += 1;
  }
  return true;
};

export const checkIfLastBotMessage = (message: Message, messages: Message[]) => {
  let pointer = messages.length - 1;
  while (pointer >= 0) {
    const curr = messages[pointer];
    if (BotMessageTypes.includes(curr?.type)) {
      return message.id === curr.id;
    }
    pointer -= 1;
  }
  return true;
};

export const checkIfLastBubble = (message: Message, messages: Message[]) => {
  let pointer = messages.length - 1;
  while (pointer >= 0) {
    const curr = messages[pointer];
    const messageType = curr.type;
    if (BotMessageTypes.includes(messageType) || messageType === MessageType.USER) {
      return message.id === curr.id;
    }
    pointer -= 1;
  }
  return true;
};

export const handleRequestActions = (request: Interaction['request']) => () => {
  if (request.payload && typeof request.payload === 'object') {
    request.payload.actions?.forEach((action: BaseRequest.Action.BaseAction) => {
      if (BaseRequest.Action.isOpenURLAction(action) && action.payload.url) {
        openURLInANewTab(action.payload.url);
      }
    });
  }
};
