import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { ErrorStage } from '@/components/PlatformUploadPopup/components';
import { NLPTrainStageType } from '@/constants/platforms';
import type { NLPTrainJob } from '@/models';

import ConnectStage from './ConnectStage';
import SuccessStage from './SuccessStage';

export const WhatsAppStageContent = {
  [NLPTrainStageType.SUCCESS]: {
    Popup: { Component: SuccessStage, closeable: true },
  },
  [NLPTrainStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
  [NLPTrainStageType.CONFIRM]: {
    Popup: { Component: ConnectStage, closeable: true },
  },
};

export const useWhatsAppStageContent = createUseJobInterfaceContent<NLPTrainJob.AnyJob>(WhatsAppStageContent);
