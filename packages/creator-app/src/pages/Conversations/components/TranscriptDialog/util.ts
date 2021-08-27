import moment from 'moment';

import { Message } from '@/pages/Prototype/types';

const calculateRelativeTimeDifference = (startTime: string, endTime: string) => {
  const start = moment(startTime);
  const end = moment(endTime);

  return moment(end.diff(start)).format('mm:ss');
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
