import { BotMessageTypes, Message } from '@/pages/Prototype/types';

export const checkIfFirstInSeries = (previousMessage: Message, currentMessage: Message) =>
  BotMessageTypes.includes(previousMessage?.type) !== BotMessageTypes.includes(currentMessage?.type);
