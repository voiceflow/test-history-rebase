import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { ErrorStage } from '@/components/PlatformUploadPopup/components';
import { AlexaStageType } from '@/constants/platforms';
import { AlexaPublishJob } from '@/models';

import SelectVendorStage from './SelectVendorStage';
import SuccessStage from './SuccessStage';
import WaitAccountStage from './WaitAccountStage';
import WaitVendorsStage from './WaitVendorsStage';

export const PublishStageContent = {
  [AlexaStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
  [AlexaStageType.SUCCESS]: {
    Popup: { Component: SuccessStage, closeable: true },
  },
  [AlexaStageType.WAIT_VENDORS]: {
    Popup: { Component: WaitVendorsStage, closeable: true },
  },
  [AlexaStageType.SELECT_VENDORS]: {
    Popup: { Component: SelectVendorStage, dismissable: true },
  },
  [AlexaStageType.WAIT_ACCOUNT]: {
    Component: WaitAccountStage,
  },
};

export const useAlexaPublishStageContent = createUseJobInterfaceContent<AlexaPublishJob.AnyJob>(PublishStageContent);
