import { FlexCenter, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { PlatformType } from '@/constants';
import { styled } from '@/hocs';
import { Container as CreateWorkspaceContainer } from '@/pages/Onboarding/Steps/CreateWorkspace/components';

import { getChannelMeta } from '../constants';
import { InstructionContainer, PlatformCardsContainer, QuestionContainer } from './components';
import PlatformCard from './components/PlatformCard';

const OPTIONS = [PlatformType.ALEXA, PlatformType.GOOGLE, PlatformType.GENERAL, PlatformType.IVR, PlatformType.CHATBOT, PlatformType.MOBILE_APP];

const Container = styled(CreateWorkspaceContainer)`
  padding-top: 0;
`;

type ChannelSelectProps = {
  onSelect: (platform: PlatformType | null) => void;
  isLoading: boolean;
  instruction?: string;
};

const ChannelSelect: React.FC<ChannelSelectProps> = ({
  onSelect,
  isLoading,
  instruction = 'Select between Amazon Alexa, Google Assistant, or a General Assistant project type',
}) => {
  // When the user clicks back on the following step, reset platform
  React.useEffect(() => {
    onSelect(null);
  }, []);

  return (
    <Container width={1080}>
      <FlexCenter>
        <div>
          <QuestionContainer>What channel do you want to create for?</QuestionContainer>
          <InstructionContainer>{instruction}</InstructionContainer>
        </div>
      </FlexCenter>
      <PlatformCardsContainer>
        {OPTIONS.map((platform, index) => (
          <PlatformCard
            key={index}
            channel={getChannelMeta(platform)}
            onClick={() => {
              if (isLoading) return;
              onSelect(platform);
            }}
          />
        ))}
      </PlatformCardsContainer>
      <FlexCenter style={{ marginTop: '32px' }}>{isLoading && <SvgIcon icon="publishSpin" color="#92a3b3" size={36} spin />}</FlexCenter>
    </Container>
  );
};

export default ChannelSelect;
