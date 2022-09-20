import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { ErrorStage } from '@/components/PlatformUploadPopup/components';
import { DialogflowStageType } from '@/constants/platforms';
import { DialogflowPublishJob } from '@/models';

import SuccessStage from './SuccessStage';
import WaitAccountStage from './WaitAccountStage';
import WaitProjectStage from './WaitProjectStage';

export const PublishStageContent = {
  [DialogflowStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
  [DialogflowStageType.SUCCESS]: {
    Popup: { Component: SuccessStage, closeable: true },
  },
  [DialogflowStageType.WAIT_ACCOUNT]: {
    Component: WaitAccountStage,
  },
  [DialogflowStageType.WAIT_PROJECT]: {
    Popup: { Component: WaitProjectStage },
  },
};

export const useDialogflowPublishStageContent = createUseJobInterfaceContent<DialogflowPublishJob.AnyJob>(PublishStageContent);
