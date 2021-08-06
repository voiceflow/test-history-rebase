import { TimeRange } from '@voiceflow/internal';

import negativeEmotion from '@/components/EmojiPicker/assets/negativeEmotion.png';
import neutralEmotion from '@/components/EmojiPicker/assets/neutralEmotion.png';
import positiveEmotion from '@/components/EmojiPicker/assets/positiveEmotion.png';
import { Sentiment } from '@/models';

export const SentimentToPNGName = {
  [Sentiment.EMOTION_NEGATIVE]: negativeEmotion,
  [Sentiment.EMOTION_POSITIVE]: positiveEmotion,
  [Sentiment.EMOTION_NEUTRAL]: neutralEmotion,
};

export const FILTER_TAG = {
  TAG: 'tag',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  RANGE: 'range',
};

export const isBuiltInRange = (range: Exclude<TimeRange, TimeRange.CUSTOM> | string) => {
  return (
    range === TimeRange.TODAY || range === TimeRange.YESTERDAY || range === TimeRange.WEEK || range === TimeRange.MONTH || range === TimeRange.ALLTIME
  );
};
