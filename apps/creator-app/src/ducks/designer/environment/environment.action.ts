import { Utils } from '@voiceflow/common';
import { Actions } from '@voiceflow/sdk-logux-designer';

import { NLUTrainingDiffStatus } from '@/constants/enums/nlu-training-diff-status.enum';

export interface SetNLUTrainingDiffStatus {
  status: NLUTrainingDiffStatus;
}

export const SetNLUTrainingDiffStatus = Utils.protocol.createAction<SetNLUTrainingDiffStatus>(
  Actions.Environment.environmentAction('SET_NLU_TRAINING_DIFF_STATUS')
);

export interface SetGateSubscriptionRevision {
  revision: string;
}

export const SetGateSubscriptionRevision = Utils.protocol.createAction<SetGateSubscriptionRevision>(
  Actions.Environment.environmentAction('SET_GATE_SUBSCRIPTION_REVISION')
);
