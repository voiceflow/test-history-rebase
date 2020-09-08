import React from 'react';

import { AlexaStageType } from '@/constants/platforms';
import { ExportContext, PublishContext } from '@/pages/Skill/contexts';

import { LoaderStage, ProgressStage } from '../shared';
import ErrorStage from './ErrorStage';
import SuccessStage from './SuccessStage';
import WaitAccountStage from './WaitAccountStage';
import WaitInvocationName from './WaitInvocationName';
import WaitVendorsStage from './WaitVendorsStage';

type AlexaProps = {
  export?: boolean;
};

export const Alexa: React.FC<AlexaProps> = (props) => {
  const exportContextValue = React.useContext(ExportContext)!;
  const publishContextValue = React.useContext(PublishContext)!;

  const contextValue = props.export ? exportContextValue : publishContextValue;

  switch (contextValue.job?.stage.type) {
    case AlexaStageType.IDLE:
      return <LoaderStage />;
    case AlexaStageType.PROGRESS:
      return <ProgressStage progress={contextValue.job.stage.data.progress}>{contextValue.job.stage.data.message}</ProgressStage>;
    case AlexaStageType.ERROR:
      return <ErrorStage stage={contextValue.job.stage} />;
    case AlexaStageType.SUCCESS:
      return <SuccessStage stage={contextValue.job.stage} cancel={contextValue.cancel} />;
    case AlexaStageType.WAIT_ACCOUNT:
      return <WaitAccountStage updateCurrentStage={contextValue.updateCurrentStage} />;
    case AlexaStageType.WAIT_VENDORS:
      return <WaitVendorsStage cancel={contextValue.cancel} />;
    case AlexaStageType.WAIT_INVOCATION_NAME:
      return <WaitInvocationName stage={contextValue.job.stage} updateCurrentStage={contextValue.updateCurrentStage} />;

    default:
      return null;
  }
};

export default Alexa;
