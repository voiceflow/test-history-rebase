import { FlexStart, Link, Text } from '@voiceflow/ui';
import React from 'react';
import Confetti from 'react-dom-confetti';

import Section from '@/components/Section';
import { GooglePublishJob, JobStageData } from '@/models';

import { StageContainer, StageHeader } from '../../components';

interface UploadedProps {
  stageData: JobStageData<GooglePublishJob.SuccessStage>;
}

const Uploaded: React.FC<UploadedProps> = ({ stageData }) => {
  const { googleProjectID, agentName } = stageData;

  return (
    <StageContainer padding="22px 0 22px 32px">
      <FlexStart>
        <StageHeader>Successfully uploaded</StageHeader>
      </FlexStart>

      <FlexStart>
        <Text textAlign="left" mb={12} pr={32} fontSize={15} lineHeight="22px" color="#132144">
          Your agent ({agentName}) is now ready for the testing on the{' '}
          <Link href={`https://dialogflow.cloud.google.com/#/editAgent/${googleProjectID}/`}>Dialogflow Console Simulator</Link>.
        </Text>
      </FlexStart>
      <Section forceDividers />
      <div id="confetti-positioner">
        <Confetti
          active={true}
          config={{
            angle: 90,
            spread: 70,
            elementCount: 75,
            startVelocity: 50,
          }}
        />
      </div>
    </StageContainer>
  );
};

export default Uploaded;
