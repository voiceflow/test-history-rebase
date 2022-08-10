import { StrengthGauge } from '@voiceflow/ui';

import { NLUIntent } from '@/pages/NLUManager/types';

export const getConfidenceMeta = () => ({
  [StrengthGauge.Level.NOT_SET]: {
    points: 0,
    message: 'No utterances set, you will need to add utterances to trigger this intent',
  },
  [StrengthGauge.Level.WEAK]: {
    points: 20,
    message: 'More utterances needed. Intents with too few utterances leads to poor accuracy.',
  },
  [StrengthGauge.Level.MEDIUM]: {
    points: 50,
    message: 'The number of utterances is sufficient. Adding more will increase intent accuracy.',
  },
  [StrengthGauge.Level.STRONG]: {
    points: 95,
    message: 'Intent contains a sufficent number of utterances to maintain a high level of accuracy.',
  },
  [StrengthGauge.Level.VERY_STRONG]: {
    points: 100,
    message: 'Intent contains a sufficent number of utterances to maintain a high level of accuracy.',
  },
});

export const getClarityMeta = (intent: NLUIntent) => ({
  [StrengthGauge.Level.NOT_SET]: {
    points: 0,
    message: '',
  },
  [StrengthGauge.Level.WEAK]: {
    points: 20,
    message: `${intent.conflictingUtterances.length} utterances in this intent are too similar to those included in ${intent.conflictingIntentIDs.length} other intent.`,
  },
  [StrengthGauge.Level.MEDIUM]: {
    points: 50,
    message: `${intent.conflictingUtterances.length} utterance in this intent is too similar to those included in ${intent.conflictingIntentIDs.length} other intent.`,
  },
  [StrengthGauge.Level.STRONG]: {
    points: 95,
    message: `${intent.conflictingUtterances.length} utterance in this intent is too similar to those included in ${intent.conflictingIntentIDs.length} other intent.`,
  },
  [StrengthGauge.Level.VERY_STRONG]: {
    points: 100,
    message: `${intent.conflictingUtterances.length} utterance in this intent is too similar to those included in ${intent.conflictingIntentIDs.length} other intent.`,
  },
});
