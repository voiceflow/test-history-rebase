/* eslint-disable import/prefer-default-export */
import moment from 'moment';

export const getTimeDuration = (pastTime: string) => {
  const diff = moment().utc().diff(pastTime);

  return moment.duration(diff).humanize();
};
