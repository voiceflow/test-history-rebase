import React from 'react';

import { AlexaStageType } from '@/constants/platforms';
import { ExportContext, PublishContext } from '@/contexts';

import { ErrorStage, LoaderStage, ProgressStage } from '../components';
import { PlatformContentProps } from '../constants';
import SelectVendorStage from './SelectVendorStage';
import SuccessStage from './SuccessStage';
import WaitInvocationName from './WaitInvocationName';
import WaitVendorsStage from './WaitVendorsStage';

export const Alexa: React.FC<PlatformContentProps> = ({ export: isExport, loader, showSelectVendor, setVendorSelected }) => {
  const exportContextValue = React.useContext(ExportContext)!;
  const publishContextValue = React.useContext(PublishContext)!;

  const contextValue = isExport ? exportContextValue : publishContextValue;

  if (showSelectVendor && setVendorSelected) {
    return <SelectVendorStage setVendorSelected={setVendorSelected} />;
  }

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
    case AlexaStageType.WAIT_INVOCATION_NAME:
      return <WaitInvocationName stage={contextValue.job.stage} updateCurrentStage={contextValue.updateCurrentStage} />;
    default:
      return null;
  }
};

export * from './constants';

export default Alexa;
