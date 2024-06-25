import { Sentiment, SystemTag } from '@/models';

const SENTIMENTS_VALUES = Object.values(Sentiment);

const SYSTEM_TAGS_VALUES = Object.values(SystemTag);

export const isSystemTag = (tagID: string): tagID is SystemTag => SYSTEM_TAGS_VALUES.includes(tagID as SystemTag);

export const isSentimentTag = (tagID: string): tagID is Sentiment => SENTIMENTS_VALUES.includes(tagID as Sentiment);

export const isBuiltInTag = (tagID: string): tagID is SystemTag | Sentiment =>
  isSystemTag(tagID) || isSentimentTag(tagID);
