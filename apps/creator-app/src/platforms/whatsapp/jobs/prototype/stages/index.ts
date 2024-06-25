import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { ErrorStage } from '@/components/PlatformUploadPopup/components';
import { TwilioPrototypeStageType } from '@/constants/platforms';
import type { TwilioPrototypeJob } from '@/models';

import MessagingStage from './MessagingStage';
import WaitNumber from './WaitNumber';

export const TwilioPrototypeStageContent = {
  [TwilioPrototypeStageType.WAIT_NUMBER]: {
    Component: WaitNumber,
  },
  [TwilioPrototypeStageType.MESSAGING]: {
    Component: MessagingStage,
  },
  [TwilioPrototypeStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
};

export const useTwilioPrototypeStageContent =
  createUseJobInterfaceContent<TwilioPrototypeJob.AnyJob>(TwilioPrototypeStageContent);
