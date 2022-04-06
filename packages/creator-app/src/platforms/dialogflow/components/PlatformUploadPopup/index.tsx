import { Utils } from '@voiceflow/common';
import React from 'react';

import { ErrorStage, LoaderStage, ProgressStage } from '@/components/PlatformUploadPopup/components';
import { PlatformContentProps } from '@/components/PlatformUploadPopup/constants';
import { DialogflowStageType } from '@/constants/platforms';
import { ExportContext, PublishContext } from '@/contexts';

import { SuccessStage, WaitProjectStage } from './components';
import { DEFAULT_ERROR_MESSAGE } from './constants';

export const PlatformUploadPopup: React.FC<PlatformContentProps> = ({
  export: isExport,
  setMultiProjects,
  createNewAgent = Utils.functional.noop,
}) => {
  const exportContextValue = React.useContext(ExportContext)!;
  const publishContextValue = React.useContext(PublishContext)!;

  const contextValue = isExport ? exportContextValue : publishContextValue;

  switch (contextValue.job?.stage.type) {
    case DialogflowStageType.IDLE:
      return <LoaderStage />;
    case DialogflowStageType.PROGRESS:
      return <ProgressStage progress={contextValue.job.stage.data.progress}>{contextValue.job.stage.data.message}</ProgressStage>;
    case DialogflowStageType.ERROR:
      return <ErrorStage stage={contextValue.job.stage} defaultMessage={DEFAULT_ERROR_MESSAGE} />;
    case DialogflowStageType.SUCCESS:
      return <SuccessStage stage={contextValue.job.stage} cancel={contextValue.cancel} />;
    case DialogflowStageType.WAIT_PROJECT:
      return (
        <WaitProjectStage
          updateCurrentStage={contextValue.updateCurrentStage}
          cancel={contextValue.cancel}
          setMultiProjects={setMultiProjects}
          createNewAgent={createNewAgent}
          retry={contextValue.retry}
        />
      );
    default:
      return null;
  }
};

export { default as CreateNewAgentModal } from './components/CreateNewAgentModal';
export { default as PlatformUploadPopupLayout } from './components/PopupLayout';

export default PlatformUploadPopup;
