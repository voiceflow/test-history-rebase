import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { NLPTrainStageType } from '@/constants/platforms';
import { NLPTrainJob } from '@/models';

import SuccessStage from './SuccessStage';

export const NLPTrainingStageContent = {
  [NLPTrainStageType.SUCCESS]: {
    Popup: { Component: SuccessStage, closeable: true },
  },
};

export const useNLPTrainingStageContent = createUseJobInterfaceContent<NLPTrainJob.AnyJob>(NLPTrainingStageContent);
