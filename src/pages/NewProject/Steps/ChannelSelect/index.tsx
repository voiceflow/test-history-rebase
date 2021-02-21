import React from 'react';

import { FlexCenter } from '@/components/Flex';
import Icon from '@/components/SvgIcon';
import { ChannelType } from '@/constants';
import { styled } from '@/hocs';
import { Container as CreateWorkspaceContainer } from '@/pages/Onboarding/Steps/CreateWorkspace/components';

import { CHANNEL_META } from '../constants';
import { InstructionContainer, PlatformCardsContainer, QuestionContainer } from './components';
import PlatformCard from './components/PlatformCard';

export const DEFAULT_OPTIONS = [ChannelType.ALEXA_ASSISTANT, ChannelType.GOOGLE_ASSISTANT, ChannelType.CUSTOM_ASSISTANT];

const Container = styled(CreateWorkspaceContainer)`
  padding-top: 0;
`;

type ChannelSelectProps = {
  onSelect: (channel: ChannelType | null) => void;
  isLoading: boolean;
  instruction?: string;
  options?: ChannelType[];
};

const ChannelSelect: React.FC<ChannelSelectProps> = ({
  onSelect,
  isLoading,
  instruction = 'Select between Amazon Alexa, Google Assistant, or a General Assistant project type',
  options = DEFAULT_OPTIONS,
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
        {options.map((channel, index) => (
          <PlatformCard
            key={index}
            channel={CHANNEL_META[channel]}
            onClick={() => {
              if (isLoading) return;
              onSelect(channel);
            }}
          />
        ))}
      </PlatformCardsContainer>
      <FlexCenter style={{ marginTop: '32px' }}>{isLoading && <Icon icon="publishSpin" color="#92a3b3" size={36} spin />}</FlexCenter>
    </Container>
  );
};

export default ChannelSelect;
