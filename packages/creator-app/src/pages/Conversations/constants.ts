import { Icon } from '@/components/SvgIcon';
import { Sentiment } from '@/models';

export const SentimentToSVGName: Record<Sentiment, Icon> = {
  [Sentiment.EMOTION_NEGATIVE]: 'negativeEmotion',
  [Sentiment.EMOTION_POSITIVE]: 'positiveEmotion',
  [Sentiment.EMOTION_NEUTRAL]: 'neutralEmotion',
};

export const FILTER_TAG = {
  TAG: 'tag',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
};
