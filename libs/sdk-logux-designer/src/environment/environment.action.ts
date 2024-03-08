import { Utils } from '@voiceflow/common';

import { createCRUD } from '@/crud/crud.action';
import type { DesignerAction } from '@/types';

export const environmentAction = createCRUD('environment');

/* NLUTrainingStatus */

export interface CalculateNLUTrainingStatus extends DesignerAction {}

export const CalculateNLUTrainingStatus = Utils.protocol.createAction<CalculateNLUTrainingStatus>(
  environmentAction('CALCULATE_NLU_TRAINING_STATUS')
);

export interface UpdateNLUTrainingStatus extends DesignerAction {
  status: 'untrained' | 'trained';
  data: null | {
    trainedCount: number;
    untrainedCount: number;
    lastTrainedTime: number | null;
    trainedSlotsCount: number;
    trainedIntentsCount: number;
    untrainedSlotsCount: number;
    untrainedIntentsCount: number;
  };
}

export const UpdateNLUTrainingStatus = Utils.protocol.createAction<UpdateNLUTrainingStatus>(
  environmentAction('UPDATE_NLU_TRAINING_STATUS')
);
