import type { QualityLevel } from '@voiceflow/ui-next/build/cjs/utils/quality-level.util';

export const getIntentConfidenceProgress = (count: number) => {
  if (count < 4) return 6.25 * count;
  if (count < 7) return 7.4 * count;
  if (count < 10) return 8.33 * count;

  return 100;
};

export const getIntentConfidenceLevel = (count: number): QualityLevel => {
  if (count < 4) return 'low';
  if (count < 7) return 'ok';
  if (count < 10) return 'good';

  return 'great';
};

export const getIntentConfidenceMessage = (count: number): string => {
  if (count < 4) return 'Not enough sample phrases. Add more to increase accuracy.';
  if (count < 10) return 'Number of phrases is sufficient, but adding more will increase accuracy.';
  return 'Intent contains enough phrases to maintain a high level of accuracy.';
};
