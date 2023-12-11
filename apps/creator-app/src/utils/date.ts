import dayjs from 'dayjs';

// eslint-disable-next-line camelcase
export const toDD_MMM_YYYY = (date: string | number | Date) => dayjs(date).format('DD MMM YY');

export const toYYYYMMDD = (date: string | number | Date) => dayjs(date).format('YYYYMMYY');
