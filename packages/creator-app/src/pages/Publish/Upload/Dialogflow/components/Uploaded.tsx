import { Box, Button, FlexCenter, Link, Text } from '@voiceflow/ui';
import React from 'react';
import styled from 'styled-components';

import { DIALOGFLOW_LEARN_MORE, getDialogflowAgentUrl } from '@/constants/platforms/dialogflow';
import { DialogflowPublishJob, JobStageData } from '@/models';

const UploadedContainer = styled(Box)`
  height: 100%;
  padding-right: 24px;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface UploadedProps {
  stageData: JobStageData<DialogflowPublishJob.SuccessStage>;
}

const Uploaded: React.FC<UploadedProps> = ({ stageData }) => {
  const { googleProjectID: dialogflowProjectID } = stageData;

  const redirectToAgent = () => window.open(getDialogflowAgentUrl(dialogflowProjectID));

  return (
    <UploadedContainer>
      <FlexCenter fullWidth>
        <Text textAlign="center" mb={20} fontSize={15} lineHeight="22px" color="#132144">
          Your agent is now ready for use on the Dialogflow Console. <Link href={DIALOGFLOW_LEARN_MORE}>Learn more</Link>
        </Text>
      </FlexCenter>
      <FlexCenter fullWidth>
        <Button onClick={redirectToAgent}>Test on Dialogflow</Button>
      </FlexCenter>
    </UploadedContainer>
  );
};

export default Uploaded;
