import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';

export const STATE_KEY = 'environment';

export interface EnvironmentState {
  nluTrainingDiff: {
    data: {
      trainedCount: number;
      untrainedCount: number;
      lastTrainedTime: number | null;
      trainedSlotsCount: number;
      trainedIntentsCount: number;
      untrainedSlotsCount: number;
      untrainedIntentsCount: number;
    };
    hash: string;
    status: NLUTrainingDiffStatus;
  };
  gateSubscriptionRevision: string;
}

export const INITIAL_STATE: EnvironmentState = {
  nluTrainingDiff: {
    data: {
      trainedCount: 0,
      untrainedCount: 0,
      lastTrainedTime: null,
      trainedSlotsCount: 0,
      trainedIntentsCount: 0,
      untrainedSlotsCount: 0,
      untrainedIntentsCount: 0,
    },
    hash: '',
    status: NLUTrainingDiffStatus.IDLE,
  },
  gateSubscriptionRevision: '',
};
