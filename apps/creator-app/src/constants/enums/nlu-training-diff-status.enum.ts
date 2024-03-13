import { Enum } from '@voiceflow/dtos';

export const NLUTrainingDiffStatus = {
  UNKNOWN: 'unknown',
  TRAINED: 'trained',
  FETCHING: 'fetching',
  UNTRAINED: 'untrained',
} as const;

export type NLUTrainingDiffStatus = Enum<typeof NLUTrainingDiffStatus>;
