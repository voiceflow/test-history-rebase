import queryString from 'query-string';

import { Query } from '@/models';

// eslint-disable-next-line import/prefer-default-export
export const parse = (search: string) => queryString.parse(search) as Query;

export const stringify = (query: Record<string | number, string | number | boolean | undefined>) => `?${queryString.stringify(query)}`;
