import { Utils } from '@voiceflow/common';

import { createCRUD } from '@/crud/crud.action';
import type { DesignerAction } from '@/types';

export const environmentAction = createCRUD('environment');

export interface UpdateNLUTrainingDiff extends DesignerAction {
  hash: string;
  status: 'untrained' | 'trained';
  data: {
    trainedCount: number;
    untrainedCount: number;
    lastTrainedTime: number | null;
    trainedSlotsCount: number;
    trainedIntentsCount: number;
    untrainedSlotsCount: number;
    untrainedIntentsCount: number;
  };
}

export const UpdateNLUTrainingDiff = Utils.protocol.createAction<UpdateNLUTrainingDiff>(
  environmentAction('UPDATE_NLU_TRAINING_DIFF')
);
