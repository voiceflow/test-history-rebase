import moment from 'moment';

import { Message } from '@/pages/Prototype/types';

const calculateRelativeTimeDifference = (startTime: string, endTime: string) => {
  const start = moment(startTime);
  const end = moment(endTime);
  return moment(end.diff(start)).format('mm:ss');
};

export const transformDialogTimestamp = (dialogs: Message[], startTime: string): Message[] => {
  dialogs.forEach((message: any) => {
    message.startTime = calculateRelativeTimeDifference(startTime, message.startTime);
  });
  return dialogs;
};

// The typings are in another PR, will fix it there
const filterDialogs = (dialogs: any) => {
  return dialogs.filter((data: any) => {
    const isAPLJson = data.aplType === 'JSON';
    return !isAPLJson;
  });
};

export const filterAndTransformDialogs = (dialogs: Message[], startTime: string): Message[] => {
  const filtered = filterDialogs(dialogs);
  return transformDialogTimestamp(filtered, startTime);
};
