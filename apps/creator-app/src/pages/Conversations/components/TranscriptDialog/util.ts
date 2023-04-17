import dayjs from 'dayjs';

import { Message } from '@/pages/Prototype/types';

const calculateRelativeTimeDifference = (startTime: string, endTime: string) => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  return dayjs(end.diff(start)).format('mm:ss');
};

export const transformDialogTimestamp = (dialogs: Message[], startTime: string): Message[] =>
  dialogs.map((message: Message) => ({
    ...message,
    startTime: calculateRelativeTimeDifference(startTime, message.startTime),
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
