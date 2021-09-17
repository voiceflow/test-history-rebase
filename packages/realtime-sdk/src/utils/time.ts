import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(duration);

export const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

export const getTimeDuration = (pastTime: string | number) => {
  const diff = dayjs().utc().diff(pastTime);

  return dayjs.duration(diff).humanize();
};

export const getAbbrevatedFormat = (time: string) =>
  time
    .split(' ')
    .map((str: string) => {
      if (str.includes('day')) {
        return 'd';
      }
      if (str.includes('hour')) {
        return 'hr';
      }
      if (str.includes('minute')) {
        return 'm';
      }
      if (str.includes('second')) {
        return 's';
      }
      if (str.includes('a')) {
        return '1';
      }
      if (str.includes('a') || str.includes('few')) {
        return null;
      }
      return str;
    })
    .filter(Boolean)
    .join('');
