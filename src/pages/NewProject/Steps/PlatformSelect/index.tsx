import React from 'react';

import { FlexCenter } from '@/components/Flex';
import Icon from '@/components/SvgIcon';
import { PlatformType } from '@/constants';
import { Container } from '@/pages/Onboarding/Steps/CreateWorkspace/components';

import { PLATFORM_META_ARRAY } from '../constants';
import { InstructionContainer, PlatformCardsContainer, QuestionContainer } from './components';
import PlatformCard from './components/PlatformCard';

type PlatformSelectProps = {
  setSelectedPlatform: (platform: PlatformType | null) => void;
  creatingSkill: boolean;
};

const PlatformSelect: React.FC<PlatformSelectProps> = ({ setSelectedPlatform, creatingSkill }) => {
  // When the user clicks back on the following step, reset platform
  React.useEffect(() => {
    setSelectedPlatform(null);
  }, []);

  return (
    <Container width={980}>
      <FlexCenter>
        <div>
          <QuestionContainer>What channel do you want to create for?</QuestionContainer>
          <InstructionContainer>Select between Amazon Alexa, Google Assistant, or a General Assistant project type</InstructionContainer>
        </div>
      </FlexCenter>
      <PlatformCardsContainer>
        {PLATFORM_META_ARRAY.map((meta, index) => (
          <PlatformCard
            key={index}
            platformMeta={meta}
            onClick={() => {
              if (creatingSkill) return;
              setSelectedPlatform(meta.platform);
            }}
          />
        ))}
      </PlatformCardsContainer>
      <FlexCenter style={{ marginTop: '32px' }}>{creatingSkill && <Icon icon="publishSpin" color="#92a3b3" size={36} spin />}</FlexCenter>
    </Container>
  );
};

export default PlatformSelect;
