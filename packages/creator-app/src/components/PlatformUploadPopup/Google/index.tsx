import React from 'react';

import { GoogleStageType } from '@/constants/platforms';
import { ExportContext, PublishContext } from '@/contexts';

import { ErrorStage, LoaderStage, ProgressStage } from '../components';
import { PlatformContentProps } from '../constants';
import SuccessStage from './SuccessStage';
import WaitInvocationName from './WaitInvocationName';
import WaitProjectStage from './WaitProjectStage';

export const Google: React.FC<PlatformContentProps> = ({ export: isExport, setMultiProjects }) => {
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

export * from './constants';

export default Google;
