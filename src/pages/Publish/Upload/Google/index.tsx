import React from 'react';

import { FeatureFlag } from '@/config/features';
import { GoogleStageType } from '@/constants/platforms';
import { useFeature } from '@/hooks';
import { ExportContext, PublishContext } from '@/pages/Skill/contexts';

import { LoaderStage, ProgressStage } from '../components';
import ErrorStage from './ErrorStage';
import SuccessStage from './SuccessStage';
import WaitAccountStage from './WaitAccountStage';
import WaitInvocationName from './WaitInvocationName';
import WaitProjectStage from './WaitProjectStage';

type GoogleProps = {
  export?: boolean;
};

export const Google: React.FC<GoogleProps> = (props) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  const exportContextValue = React.useContext(ExportContext)!;
  const publishContextValue = React.useContext(PublishContext)!;

  const contextValue = props.export ? exportContextValue : publishContextValue;

  switch (contextValue.job?.stage.type) {
    case GoogleStageType.IDLE:
      return <LoaderStage />;
    case GoogleStageType.PROGRESS:
      return <ProgressStage progress={contextValue.job.stage.data.progress}>{contextValue.job.stage.data.message}</ProgressStage>;
    case GoogleStageType.ERROR:
      return <ErrorStage stage={contextValue.job.stage} />;
    case GoogleStageType.SUCCESS:
      return <SuccessStage stage={contextValue.job.stage} cancel={contextValue.cancel} />;
    case GoogleStageType.WAIT_ACCOUNT:
      return !headerRedesign.isEnabled ? <WaitAccountStage updateCurrentStage={contextValue.updateCurrentStage} /> : null;
    case GoogleStageType.WAIT_PROJECT:
      return <WaitProjectStage updateCurrentStage={contextValue.updateCurrentStage} cancel={contextValue.cancel} />;
    case GoogleStageType.WAIT_INVOCATION_NAME:
      return <WaitInvocationName stage={contextValue.job.stage} updateCurrentStage={contextValue.updateCurrentStage} />;
    default:
      return null;
  }
};

export default Google;
