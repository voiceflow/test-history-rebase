import cuid from 'cuid';
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
    message.id += `${cuid.slug()}`;
  });
  return dialogs;
};
