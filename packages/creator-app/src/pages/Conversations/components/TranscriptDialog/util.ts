import moment from 'moment';

import { DialogMessage } from '@/client/adapters/transcripts/dialogs';

const calculateRelativeTimeDifference = (startTime: string, endTime: string) => {
  const start = moment(startTime);
  const end = moment(endTime);

  return moment(end.diff(start)).format('mm:ss');
};

export const transformDialogTimestamp = (dialogs: DialogMessage[], startTime: string): DialogMessage[] =>
  dialogs.map((message: DialogMessage) => ({
    ...message,
    startTime: calculateRelativeTimeDifference(startTime, message.startTime),
  }));

const filterDialogs = (dialogs: DialogMessage[]) => dialogs.filter((data: DialogMessage) => data.aplType !== 'JSON');

export const filterAndTransformDialogs = (dialogs: DialogMessage[], startTime: string): DialogMessage[] => {
  const filtered = filterDialogs(dialogs);

  return transformDialogTimestamp(filtered, startTime);
};

export type TurnMap = Map<string, Omit<DialogMessage, 'turnID'>[]>;

export const generateTurnMap = (dialogs: DialogMessage[]): TurnMap => {
  const turnMap = new Map<string, Omit<DialogMessage, 'turnID'>[]>();

  dialogs.forEach(({ turnID, ...props }) => {
    const turnArray = turnMap.get(turnID) || [];
    const newTurnArray = [...turnArray, props];

    turnMap.set(turnID, newTurnArray);
  });

  return turnMap;
};
