import { TimeRange } from '@voiceflow/internal';

import negativeEmotion from '@/components/EmojiPicker/assets/negativeEmotion.png';
import neutralEmotion from '@/components/EmojiPicker/assets/neutralEmotion.png';
import positiveEmotion from '@/components/EmojiPicker/assets/positiveEmotion.png';
import { Sentiment } from '@/models';

export const SentimentToPNGName: Record<Sentiment, string> = {
  [Sentiment.EMOTION_NEUTRAL]: neutralEmotion,
  [Sentiment.EMOTION_NEGATIVE]: negativeEmotion,
  [Sentiment.EMOTION_POSITIVE]: positiveEmotion,
};

export enum FilterTag {
  TAG = 'tag',
  RANGE = 'range',
  END_DATE = 'endDate',
  START_DATE = 'startDate',
}

export const isBuiltInRange = (range: Exclude<TimeRange, TimeRange.CUSTOM> | string) =>
  range !== TimeRange.CUSTOM && Object.values(TimeRange).includes(range as TimeRange);
