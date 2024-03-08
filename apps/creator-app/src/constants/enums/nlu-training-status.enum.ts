import { Enum } from '@voiceflow/dtos';

export const NLUTrainingStatus = {
  UNKNOWN: 'unknown',
  TRAINED: 'trained',
  UNTRAINED: 'untrained',
  CALCULATING: 'calculating',
} as const;

export type NLUTrainingStatus = Enum<typeof NLUTrainingStatus>;
