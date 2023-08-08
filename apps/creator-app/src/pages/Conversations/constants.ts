import { TimeRange } from '@voiceflow/internal';

import { Sentiment } from '@/models';

import negativeEmotion from './assets/negativeEmotion.png';
import neutralEmotion from './assets/neutralEmotion.png';
import positiveEmotion from './assets/positiveEmotion.png';

export const SentimentToPNGName: Record<Sentiment, string> = {
  [Sentiment.EMOTION_NEUTRAL]: neutralEmotion,
  [Sentiment.EMOTION_NEGATIVE]: negativeEmotion,
  [Sentiment.EMOTION_POSITIVE]: positiveEmotion,
};

export enum FilterTag {
  TAG = 'tag',
  PERSONA = 'persona',
  RANGE = 'range',
  END_DATE = 'endDate',
  START_DATE = 'startDate',
}

export const isBuiltInRange = (range: Exclude<TimeRange, TimeRange.CUSTOM> | string) =>
  range !== TimeRange.CUSTOM && Object.values(TimeRange).includes(range as TimeRange);
