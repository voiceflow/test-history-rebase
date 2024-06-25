import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { ErrorStage } from '@/components/PlatformUploadPopup/components';
import { SMSPublishStageType } from '@/constants/platforms';
import type { SMSPublishJob } from '@/models';

import ConnectStage from './ConnectStage';
import SuccessStage from './SuccessStage';

export const SMSStageContent = {
  [SMSPublishStageType.CHECK_API_SECRETS]: {
    Popup: { Component: ConnectStage, closeable: true },
  },
  [SMSPublishStageType.CHECK_SERVICE]: {
    Popup: { Component: ConnectStage, closeable: true },
  },
  [SMSPublishStageType.VALIDATE_NUMBERS]: {
    Popup: { Component: ConnectStage, closeable: true },
  },
  [SMSPublishStageType.SUCCESS]: {
    Popup: { Component: SuccessStage, closeable: true },
  },

  [SMSPublishStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
};

export const useSMSStageContent = createUseJobInterfaceContent<SMSPublishJob.AnyJob>(SMSStageContent);
