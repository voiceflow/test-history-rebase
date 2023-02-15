import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import { DIALOGFLOW_ES_LEARN_MORE, getDialogflowESAgentUrl } from '@/constants/platforms/dialogflowES';
import { DialogflowESPublishJob, JobStageData } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const SuccessStage: React.FC<StageComponentProps<DialogflowESPublishJob.SuccessStage>> = ({ stage }) => {
  const { googleProjectID: dialogflowProjectID } = stage.data as JobStageData<DialogflowESPublishJob.SuccessStage>;

  return (
    <UploadedStage
      buttonText="Test on Dialogflow"
      description="Your agent is now ready for use on the Dialogflow Console"
      learnMoreUrl={DIALOGFLOW_ES_LEARN_MORE}
      redirectUrl={getDialogflowESAgentUrl(dialogflowProjectID)}
    />
  );
};

export default SuccessStage;
