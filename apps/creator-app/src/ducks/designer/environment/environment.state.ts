import { Nullable } from '@voiceflow/ui-next';

import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';

export const STATE_KEY = 'environment';

export interface EnvironmentState {
  nluTrainingDiff: {
    data: Nullable<{
      trainedCount: number;
      untrainedCount: number;
      lastTrainedTime: number | null;
      trainedSlotsCount: number;
      trainedIntentsCount: number;
      untrainedSlotsCount: number;
      untrainedIntentsCount: number;
    }>;
    status: NLUTrainingDiffStatus;
  };
}

export const INITIAL_STATE: EnvironmentState = {
  nluTrainingDiff: {
    data: null,
    status: NLUTrainingDiffStatus.UNKNOWN,
  },
};
