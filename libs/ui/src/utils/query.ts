import queryString from 'query-string';

export const parseQuery = <Q extends Record<string, string | number | boolean | undefined>>(search: string) =>
  queryString.parse(search) as Q;

export const stringifyQuery = (query: Record<string | number, string | number | boolean | undefined>) =>
  `?${queryString.stringify(query)}`;
