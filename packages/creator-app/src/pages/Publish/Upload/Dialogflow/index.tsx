import React from 'react';

import { DialogflowStageType } from '@/constants/platforms';
import { ExportContext, PublishContext } from '@/pages/Skill/contexts';

import { LoaderStage, ProgressStage } from '../components';
import ErrorStage from './ErrorStage';
import SuccessStage from './SuccessStage';
import WaitProjectStage from './WaitProjectState';

interface DialogflowProps {
  export?: boolean;
  setMultiProjects?: (value: boolean) => void;
}

export const Dialogflow: React.FC<DialogflowProps> = ({ export: isExport, setMultiProjects }) => {
  const exportContextValue = React.useContext(ExportContext)!;
  const publishContextValue = React.useContext(PublishContext)!;

  const contextValue = isExport ? exportContextValue : publishContextValue;

  switch (contextValue.job?.stage.type) {
    case DialogflowStageType.IDLE:
      return <LoaderStage />;
    case DialogflowStageType.PROGRESS:
      return <ProgressStage progress={contextValue.job.stage.data.progress}>{contextValue.job.stage.data.message}</ProgressStage>;
    case DialogflowStageType.ERROR:
      return <ErrorStage stage={contextValue.job.stage} />;
    case DialogflowStageType.SUCCESS:
      return <SuccessStage stage={contextValue.job.stage} cancel={contextValue.cancel} />;
    case DialogflowStageType.WAIT_PROJECT:
      return (
        <WaitProjectStage updateCurrentStage={contextValue.updateCurrentStage} cancel={contextValue.cancel} setMultiProjects={setMultiProjects} />
      );
    default:
      return null;
  }
};

export default Dialogflow;
