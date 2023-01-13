import dayjs from 'dayjs';

export const formatImportedAt = (date: string | Date) => dayjs(date.toString()).fromNow();

export const formatImportedAtDate = (date: string | Date) => dayjs(date.toString()).format('MMM Do');
