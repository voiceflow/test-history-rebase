import React from 'react';

import { AlexaStageType } from '@/constants/platforms';
import { PublishContext } from '@/pages/Skill/contexts';

import { LoaderStage, ProgressStage } from '../shared';
import ErrorStage from './ErrorStage';
import SuccessStage from './SuccessStage';
import WaitAccountStage from './WaitAccountStage';
import WaitInvocationName from './WaitInvocationName';
import WaitVendorsStage from './WaitVendorsStage';

export const Alexa = () => {
  const { job } = React.useContext(PublishContext)!;

  switch (job?.stage.type) {
    case AlexaStageType.IDLE:
      return <LoaderStage />;
    case AlexaStageType.PROGRESS:
      return <ProgressStage progress={job.stage.data.progress}>{job.stage.data.message}</ProgressStage>;
    case AlexaStageType.ERROR:
      return <ErrorStage />;
    case AlexaStageType.SUCCESS:
      return <SuccessStage />;
    case AlexaStageType.WAIT_ACCOUNT:
      return <WaitAccountStage />;
    case AlexaStageType.WAIT_VENDORS:
      return <WaitVendorsStage />;
    case AlexaStageType.WAIT_INVOCATION_NAME:
      return <WaitInvocationName />;

    default:
      return null;
  }
};

export default Alexa;
