import React from 'react';

import { ErrorStage, LoaderStage, ProgressStage } from '@/components/PlatformUploadPopup/components';
import { PlatformContentProps } from '@/components/PlatformUploadPopup/constants';
import { GoogleStageType } from '@/constants/platforms';
import { ExportContext, PublishContext } from '@/contexts';

import { SuccessStage, WaitInvocationName, WaitProjectStage } from './components';

export const PlatformUploadPopup: React.FC<PlatformContentProps> = ({ export: isExport, setMultiProjects }) => {
  const exportContextValue = React.useContext(ExportContext)!;
  const publishContextValue = React.useContext(PublishContext)!;

  const contextValue = isExport ? exportContextValue : publishContextValue;

  switch (contextValue.job?.stage.type) {
    case GoogleStageType.IDLE:
      return <LoaderStage />;
    case GoogleStageType.PROGRESS:
      return <ProgressStage progress={contextValue.job.stage.data.progress}>{contextValue.job.stage.data.message}</ProgressStage>;
    case GoogleStageType.ERROR:
      return <ErrorStage stage={contextValue.job.stage} />;
    case GoogleStageType.SUCCESS:
      return <SuccessStage stage={contextValue.job.stage} cancel={contextValue.cancel} />;
    case GoogleStageType.WAIT_PROJECT:
      return (
        <WaitProjectStage updateCurrentStage={contextValue.updateCurrentStage} cancel={contextValue.cancel} setMultiProjects={setMultiProjects} />
      );
    case GoogleStageType.WAIT_INVOCATION_NAME:
      return <WaitInvocationName stage={contextValue.job.stage} updateCurrentStage={contextValue.updateCurrentStage} />;
    default:
      return null;
  }
};

export { default as PlatformUploadPopupLayout } from './components/PopupLayout';

export default PlatformUploadPopup;
