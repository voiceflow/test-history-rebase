import client from '@/client';

// side effects

// eslint-disable-next-line import/prefer-default-export
export const trackSessionTime = (duration, skillID) => async () => client.analytics.trackSessionTime(duration, skillID);
