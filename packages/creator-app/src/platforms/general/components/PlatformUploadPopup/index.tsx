import React from 'react';

import { ErrorStage, LoaderStage, ProgressStage } from '@/components/PlatformUploadPopup/components';
import { PlatformContentProps } from '@/components/PlatformUploadPopup/constants';
import { GeneralStageType } from '@/constants/platforms';
import { ExportContext } from '@/contexts';

import { SuccessStage } from './components';

export const PlatformUploadPopup: React.FC<PlatformContentProps> = () => {
  const exportValue = React.useContext(ExportContext)!;

  switch (exportValue.job?.stage.type) {
    case GeneralStageType.IDLE:
      return <LoaderStage />;
    case GeneralStageType.PROGRESS:
      return <ProgressStage progress={exportValue.job.stage.data.progress}>{exportValue.job.stage.data.message}</ProgressStage>;
    case GeneralStageType.ERROR:
      return <ErrorStage stage={exportValue.job.stage} />;
    case GeneralStageType.SUCCESS:
      return <SuccessStage stage={exportValue.job.stage} cancel={exportValue.cancel} />;
    default:
      return null;
  }
};

export { default as PlatformUploadPopupLayout } from './components/PopupLayout';

export default PlatformUploadPopup;
