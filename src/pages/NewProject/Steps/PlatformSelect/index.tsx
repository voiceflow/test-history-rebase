import React from 'react';

import { FlexCenter } from '@/components/Flex';
import Icon from '@/components/SvgIcon';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { useFeature } from '@/hooks';
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

  const actionsEnv = useFeature(FeatureFlag.ACTIONS_ENV);
  const generalPlatform = useFeature(FeatureFlag.GENERAL_PLATFORM);

  return (
    <Container width={980}>
      <FlexCenter>
        <div>
          <QuestionContainer>What channel do you want to create for?</QuestionContainer>
          <InstructionContainer>
            Select between Amazon Alexa, or Google Assistant
            {/*or a general design & prototyping project type.*/}
          </InstructionContainer>
        </div>
      </FlexCenter>
      <PlatformCardsContainer>
        {PLATFORM_META_ARRAY.filter(({ platform }) => platform !== PlatformType.GENERAL || generalPlatform.isEnabled).map((meta, index) => {
          return (
            <PlatformCard
              key={index}
              disabled={actionsEnv.isEnabled && meta.platform !== PlatformType.GOOGLE}
              platformMeta={meta}
              onClick={() => {
                if (creatingSkill) return;
                setSelectedPlatform(meta.platform);
              }}
            />
          );
        })}
      </PlatformCardsContainer>
      <FlexCenter style={{ marginTop: '32px' }}>{creatingSkill && <Icon icon="publishSpin" color="#92a3b3" size={36} spin />}</FlexCenter>
    </Container>
  );
};

export default PlatformSelect;
