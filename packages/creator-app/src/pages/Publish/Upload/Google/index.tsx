import React from 'react';

import { FeatureFlag } from '@/config/features';
import { GoogleStageType } from '@/constants/platforms';
import { useFeature } from '@/hooks';
import { ExportContext, PublishContext } from '@/pages/Skill/contexts';

import { LoaderStage, ProgressStage } from '../components';
import ErrorStage from './ErrorStage';
import SuccessStage from './SuccessStage';
import WaitDFESProjectStage from './WaitDFESProjectState';
import WaitInvocationName from './WaitInvocationName';
import WaitProjectStage from './WaitProjectStage';

interface GoogleProps {
  export?: boolean;
  setMultiProjects?: (value: boolean) => void;
}

export const Google: React.FC<GoogleProps> = ({ export: isExport, setMultiProjects }) => {
  const isDialogFlow = useFeature(FeatureFlag.DIALOGFLOW)?.isEnabled;
  const WaitStage = isDialogFlow ? WaitDFESProjectStage : WaitProjectStage;

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
      return <WaitStage updateCurrentStage={contextValue.updateCurrentStage} cancel={contextValue.cancel} setMultiProjects={setMultiProjects} />;
    case GoogleStageType.WAIT_INVOCATION_NAME:
      return <WaitInvocationName stage={contextValue.job.stage} updateCurrentStage={contextValue.updateCurrentStage} />;
    default:
      return null;
  }
};

export default Google;
