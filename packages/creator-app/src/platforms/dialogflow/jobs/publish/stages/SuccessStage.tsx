import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import { DIALOGFLOW_LEARN_MORE, getDialogflowAgentUrl } from '@/constants/platforms/dialogflow';
import { DialogflowPublishJob, JobStageData } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const SuccessStage: React.FC<StageComponentProps<DialogflowPublishJob.SuccessStage>> = ({ stage }) => {
  const { googleProjectID: dialogflowProjectID } = stage.data as JobStageData<DialogflowPublishJob.SuccessStage>;

  return (
    <UploadedStage
      buttonText="Test on Dialogflow"
      description="Your agent is now ready for use on the Dialogflow Console"
      learnMoreUrl={DIALOGFLOW_LEARN_MORE}
      redirectUrl={getDialogflowAgentUrl(dialogflowProjectID)}
    />
  );
};

export default SuccessStage;
