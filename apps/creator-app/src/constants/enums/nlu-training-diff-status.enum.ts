import { Enum } from '@voiceflow/dtos';

export const NLUTrainingDiffStatus = {
  IDLE: 'idle',
  TRAINED: 'trained',
  FETCHING: 'fetching',
  UNTRAINED: 'untrained',
} as const;

export type NLUTrainingDiffStatus = Enum<typeof NLUTrainingDiffStatus>;
