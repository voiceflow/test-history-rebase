import React from 'react';

import { FlexCenter } from '@/components/Flex';
import { Container } from '@/pages/Onboarding/Steps/CreateWorkspace/components';

import { PLATFORM_META_ARRAY, Platform } from '../constants';
import { InstructionContainer, PlatformCardsContainer, QuestionContainer } from './components';
import PlatformCard from './components/PlatformCard';

type PlatformSelectProps = {
  setSelectedPlatform: (platform: Platform | null) => void;
};

const PlatformSelect: React.FC<PlatformSelectProps> = ({ setSelectedPlatform }) => {
  // When the user clicks back on the following step, reset platform
  React.useEffect(() => {
    setSelectedPlatform(null);
  }, []);

  return (
    <Container width={980}>
      <FlexCenter>
        <div>
          <QuestionContainer>What channel do you want to create for?</QuestionContainer>
          <InstructionContainer>Select between Amazon Alexa, Google Assistant, or a general design & prototyping project type.</InstructionContainer>
        </div>
      </FlexCenter>
      <PlatformCardsContainer>
        {PLATFORM_META_ARRAY.map((meta, index) => {
          return <PlatformCard key={index} platformMeta={meta} onClick={() => setSelectedPlatform(meta.platform)} />;
        })}
      </PlatformCardsContainer>
    </Container>
  );
};

export default PlatformSelect;
