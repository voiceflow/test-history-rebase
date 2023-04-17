import { createUseJobInterfaceContent, ErrorStage } from '@/components/JobInterface';
import { DialogflowCXStageType } from '@/constants/platforms';
import { DialogflowCXPublishJob } from '@/models';

import SuccessStage from './SuccessStage';
import WaitAccountStage from './WaitAccountStage';
import WaitAgentStage from './WaitAgentStage';
import WaitVersionName from './WaitVersionName';

export const PublishStageContent = {
  [DialogflowCXStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
  [DialogflowCXStageType.SUCCESS]: {
    Popup: { Component: SuccessStage, closeable: true },
  },
  [DialogflowCXStageType.WAIT_ACCOUNT]: {
    Component: WaitAccountStage,
  },
  [DialogflowCXStageType.WAIT_AGENT]: {
    Component: WaitAgentStage,
  },
  [DialogflowCXStageType.WAIT_VERSION_NAME]: {
    Component: WaitVersionName,
  },
};

export const useDialogflowCXPublishStageContent = createUseJobInterfaceContent<DialogflowCXPublishJob.AnyJob>(PublishStageContent);
