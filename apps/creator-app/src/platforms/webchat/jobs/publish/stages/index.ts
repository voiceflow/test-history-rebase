import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { ErrorStage } from '@/components/PlatformUploadPopup/components';
import { NLPTrainStageType } from '@/constants/platforms';
import type { NLPTrainJob } from '@/models';

import SuccessStage from './SuccessStage';

export const WebchatStageContent = {
  [NLPTrainStageType.SUCCESS]: {
    Popup: { Component: SuccessStage, closeable: true },
  },
  [NLPTrainStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
};

export const useWebchatStageContent = createUseJobInterfaceContent<NLPTrainJob.AnyJob>(WebchatStageContent);
