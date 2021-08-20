import moment from 'moment';

import { DialogMessage } from '@/client/adapters/transcripts/dialogs';

const calculateRelativeTimeDifference = (startTime: string, endTime: string) => {
  const start = moment(startTime);
  const end = moment(endTime);
  return moment(end.diff(start)).format('mm:ss');
};

export const transformDialogTimestamp = (dialogs: DialogMessage[], startTime: string): DialogMessage[] => {
  dialogs.forEach((message: DialogMessage) => {
    message.startTime = calculateRelativeTimeDifference(startTime, message.startTime);
  });
  return dialogs;
};

// The typings are in another PR, will fix it there
const filterDialogs = (dialogs: DialogMessage[]) => {
  return dialogs.filter((data: DialogMessage) => {
    const isAPLJson = data.aplType === 'JSON';
    return !isAPLJson;
  });
};

export const filterAndTransformDialogs = (dialogs: DialogMessage[], startTime: string): DialogMessage[] => {
  const filtered = filterDialogs(dialogs);
  return transformDialogTimestamp(filtered, startTime);
};

export const generateTurnMap = (dialogs: DialogMessage[]) => {
  const turnMap = new Map();
  dialogs.forEach(({ turnID, ...props }) => {
    const turnArray = turnMap.get(turnID) || [];
    const newTurnArray = [...turnArray, { ...props }];
    turnMap.set(turnID, newTurnArray);
  });

  return turnMap;
};
