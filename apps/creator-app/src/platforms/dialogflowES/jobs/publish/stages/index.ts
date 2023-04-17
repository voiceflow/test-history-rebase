import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { ErrorStage } from '@/components/PlatformUploadPopup/components';
import { DialogflowESStageType } from '@/constants/platforms';
import { DialogflowESPublishJob } from '@/models';

import SuccessStage from './SuccessStage';
import WaitAccountStage from './WaitAccountStage';
import WaitProjectStage from './WaitProjectStage';

export const PublishStageContent = {
  [DialogflowESStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
  [DialogflowESStageType.SUCCESS]: {
    Popup: { Component: SuccessStage, closeable: true },
  },
  [DialogflowESStageType.WAIT_ACCOUNT]: {
    Component: WaitAccountStage,
  },
  [DialogflowESStageType.WAIT_PROJECT]: {
    Popup: { Component: WaitProjectStage },
  },
};

export const useDialogflowPublishStageContent = createUseJobInterfaceContent<DialogflowESPublishJob.AnyJob>(PublishStageContent);
