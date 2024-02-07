import dayjs from 'dayjs';

export const ONE_DAY = 1000 * 60 * 60 * 24;

export const removeTimezone = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

export const to_DD_MMM_YYYY = (date: Date) => dayjs(date).format('DD MMM YY');
