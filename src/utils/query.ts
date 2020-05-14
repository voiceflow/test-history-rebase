import queryString from 'query-string';

import { Query } from '@/models';

// eslint-disable-next-line import/prefer-default-export
export const parse = (search: string) => queryString.parse(search) as Query;
