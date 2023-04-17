import { StrengthGauge } from '@voiceflow/ui';

import { NLUIntent } from '@/pages/NLUManager/types';

const clarityMetaMessage = (intent: NLUIntent) => {
  const conflictingUtterances = intent.conflictingUtterances.length;
  const conflictingIntents = intent.conflictingIntentIDs.length;

  if (!conflictingUtterances) return '';

  if (conflictingUtterances > 1) {
    return `${conflictingUtterances} utterances in this intent are too similar to those included in ${conflictingIntents} other intent.`;
  }

  return `1 utterance in this intent is too similar to those included in ${conflictingIntents} other intent.`;
};

export const getConfidenceMeta = () => ({
  [StrengthGauge.Level.NOT_SET]: {
    message: 'No utterances set, you will need to add utterances to trigger this intent',
  },
  [StrengthGauge.Level.WEAK]: {
    message: 'More utterances needed. Intents with too few utterances leads to poor accuracy.',
  },
  [StrengthGauge.Level.MEDIUM]: {
    message: 'The number of utterances is sufficient. Adding more will increase intent accuracy.',
  },
  [StrengthGauge.Level.STRONG]: {
    message: 'Intent contains a sufficent number of utterances to maintain a high level of accuracy.',
  },
  [StrengthGauge.Level.VERY_STRONG]: {
    message: 'Intent contains a sufficent number of utterances to maintain a high level of accuracy.',
  },
});

export const getClarityMeta = (intent: NLUIntent) => ({
  [StrengthGauge.Level.NOT_SET]: { message: '' },
  [StrengthGauge.Level.LOADING]: { message: '' },
  [StrengthGauge.Level.WEAK]: { message: clarityMetaMessage(intent) },
  [StrengthGauge.Level.MEDIUM]: { message: clarityMetaMessage(intent) },
  [StrengthGauge.Level.STRONG]: { message: clarityMetaMessage(intent) },
  [StrengthGauge.Level.VERY_STRONG]: { message: clarityMetaMessage(intent) },
});
