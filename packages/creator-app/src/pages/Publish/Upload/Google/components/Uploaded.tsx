import React from 'react';
import Confetti from 'react-dom-confetti';

import { FlexStart } from '@/components/Flex';
import Section from '@/components/Section';
import { Link, Text } from '@/components/Text';
import { GooglePublishJob, JobStageData } from '@/models';

import { DropdownSection, StageContainer, StageHeader } from '../../components';

type UploadedProps = {
  stageData: JobStageData<GooglePublishJob.SuccessStage>;
};

const Uploaded: React.FC<UploadedProps> = ({ stageData }) => {
  const { googleProjectID } = stageData;

  return (
    <StageContainer padding="22px 0 22px 32px">
      <FlexStart>
        <StageHeader>Successfully uploaded</StageHeader>
      </FlexStart>

      <FlexStart>
        <Text textAlign="left" mb={12} pr={32} fontSize={15} lineHeight="22px" color="#132144">
          Your action is now ready for the testing on the{' '}
          <Link href={`https://console.actions.google.com/project/${googleProjectID}/simulator/`}>Actions Console Simulator</Link>.
        </Text>
      </FlexStart>
      <DropdownSection title="Testing on Simulator">
        <Text textAlign="left" mb={0} fontSize={15} lineHeight="22px" color="#132144">
          Google provides an Actions simulator in the Actions Console. This allows you to test your Action using voice, text, or chip input.
        </Text>
      </DropdownSection>
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
