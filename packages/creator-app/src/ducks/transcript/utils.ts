import { Sentiment, SentimentArray, SystemTag, SystemTagArray } from '@/models';

export const isBuiltInTag = (tagID: string) => {
  return SentimentArray.includes(tagID as Sentiment) || SystemTagArray.includes(tagID as SystemTag);
};
