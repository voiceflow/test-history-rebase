import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';

import { Message } from '@/pages/Prototype/types';

dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export const transformDialogTimestamp = (dialogs: Message[]): Message[] =>
  dialogs.map((message: Message) => ({
    ...message,
    startTime: dayjs(message.startTime).format('MMM Do, h:mmA z'),
  }));

export type TurnMap = Map<string, Message[]>;

export const generateTurnMap = (dialogs: Message[]): TurnMap => {
  const turnMap = new Map<string, Message[]>();

  dialogs.forEach((message) => {
    const turnArray = turnMap.get(message.turnID!) || [];
    const newTurnArray = [...turnArray, message];

    turnMap.set(message.turnID!, newTurnArray);
  });

  return turnMap;
};
