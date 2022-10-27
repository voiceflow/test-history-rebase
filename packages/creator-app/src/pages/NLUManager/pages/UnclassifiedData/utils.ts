import dayjs from 'dayjs';

export const formatImportedAt = (date: Date) => dayjs(date.toString()).fromNow();

export const formatImportedAtDate = (date: Date) => dayjs(date.toString()).format('MMM Do');
