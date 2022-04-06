import React from 'react';

import { ErrorStage, LoaderStage, ProgressStage } from '@/components/PlatformUploadPopup/components';
import { PlatformContentProps } from '@/components/PlatformUploadPopup/constants';
import { AlexaStageType } from '@/constants/platforms';
import { ExportContext, PublishContext } from '@/contexts';

import { SelectVendorStage, SuccessStage, WaitInvocationName, WaitVendorsStage } from './components';

export const PlatformUploadPopup: React.FC<PlatformContentProps> = ({ export: isExport, loader }) => {
  const exportContextValue = React.useContext(ExportContext)!;
  const publishContextValue = React.useContext(PublishContext)!;

  const contextValue = isExport ? exportContextValue : publishContextValue;

  switch (contextValue.job?.stage.type) {
    case AlexaStageType.IDLE:
      return <LoaderStage />;
    case AlexaStageType.PROGRESS:
      return (
        <>
          <ProgressStage progress={contextValue.job.stage.data.progress}>{contextValue.job.stage.data.message}</ProgressStage>
          {loader && <LoaderStage />}
        </>
      );
    case AlexaStageType.ERROR:
      return <ErrorStage stage={contextValue.job.stage} />;
    case AlexaStageType.SUCCESS:
      return <SuccessStage stage={contextValue.job.stage} cancel={contextValue.cancel} />;
    case AlexaStageType.WAIT_VENDORS:
      return <WaitVendorsStage cancel={contextValue.cancel} />;
    case AlexaStageType.SELECT_VENDORS:
      return <SelectVendorStage />;
    case AlexaStageType.WAIT_INVOCATION_NAME:
      return <WaitInvocationName stage={contextValue.job.stage} updateCurrentStage={contextValue.updateCurrentStage} />;
    default:
      return null;
  }
};

export { default as PlatformUploadPopupLayout } from './components/PopupLayout';

export default PlatformUploadPopup;
