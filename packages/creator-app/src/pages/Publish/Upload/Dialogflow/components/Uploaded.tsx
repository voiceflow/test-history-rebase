import { Button, FlexCenter, FlexStart, Link, Text } from '@voiceflow/ui';
import React from 'react';

import { DIALOGFLOW_AGENT_OVERVIEW_URL, getDialogflowAgentUrl } from '@/constants/platforms/dialogflow';
import { DialogflowPublishJob, JobStageData } from '@/models';

import { StageContainer } from '../../components';

interface UploadedProps {
  stageData: JobStageData<DialogflowPublishJob.SuccessStage>;
}

const Uploaded: React.FC<UploadedProps> = ({ stageData }) => {
  const { googleProjectID: dialogflowProjectID } = stageData;

  const redirectToAgent = () => window.open(getDialogflowAgentUrl(dialogflowProjectID));

  return (
    <StageContainer padding="24px 32px">
      <FlexStart>
        <Text textAlign="center" mb={20} pr={32} fontSize={15} lineHeight="22px" color="#132144">
          Your agent is now ready for use on the Dialogflow Console. <Link href={DIALOGFLOW_AGENT_OVERVIEW_URL}>Learn more</Link>.
        </Text>
      </FlexStart>
      <FlexCenter>
        <Button onClick={redirectToAgent}>Test on Dialogflow</Button>
      </FlexCenter>
    </StageContainer>
  );
};

export default Uploaded;
