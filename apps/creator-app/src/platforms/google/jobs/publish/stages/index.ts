import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { ErrorStage } from '@/components/PlatformUploadPopup/components';
import { GoogleStageType } from '@/constants/platforms';
import { GooglePublishJob } from '@/models';

import SuccessStage from './SuccessStage';
import WaitAccountStage from './WaitAccountStage';
import WaitProjectStage from './WaitProjectStage';

export const PublishStageContent = {
  [GoogleStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
  [GoogleStageType.SUCCESS]: {
    Popup: { Component: SuccessStage, closeable: true },
  },
  [GoogleStageType.WAIT_ACCOUNT]: {
    Component: WaitAccountStage,
  },
  [GoogleStageType.WAIT_PROJECT]: {
    Popup: { Component: WaitProjectStage, dismissable: true },
  },
};

export const useGooglePublishStageContent = createUseJobInterfaceContent<GooglePublishJob.AnyJob>(PublishStageContent);
