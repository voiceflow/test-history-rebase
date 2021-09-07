import { SentimentArray, SystemTagArray } from '@/models';

const BUILT_IN_TAGS_MAP: Record<string, true> = [...SentimentArray, ...SystemTagArray].reduce<Record<string, true>>(
  (acc, tagID) => Object.assign(acc, { [tagID]: true }),
  {}
);

// eslint-disable-next-line import/prefer-default-export
export const isBuiltInTag = (tagID: string): boolean => !!BUILT_IN_TAGS_MAP[tagID];
