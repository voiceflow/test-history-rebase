import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import { DIALOGFLOW_CX_LEARN_MORE } from '@/constants/platforms';
import { getDialogflowCXAgentUrl } from '@/constants/platforms/dialogflowCX';
import { DialogflowCXPublishJob, JobStageData } from '@/models';

interface SuccessStageProps {
  stage: DialogflowCXPublishJob.SuccessStage;
}

const SuccessStage: React.FC<SuccessStageProps> = ({ stage }) => {
  const { agentName } = stage.data as JobStageData<DialogflowCXPublishJob.SuccessStage>;

  return (
    <UploadedStage
      buttonText="Open in Dialogflow CX"
      description="Your agent is now ready for use on Dialogflow CX console"
      learnMoreUrl={DIALOGFLOW_CX_LEARN_MORE}
      redirectUrl={getDialogflowCXAgentUrl(agentName)}
    />
  );
};

export default SuccessStage;
