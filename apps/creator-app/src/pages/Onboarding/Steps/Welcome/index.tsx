import { Animations, Description, FlexCenter, SvgIcon, Title } from '@voiceflow/ui';
import React from 'react';

import ContinueButton from '@/pages/Onboarding/components/ContinueButton';

import { useOnboardingContext } from '../../context';
import * as S from './styles';

const fadeConfig = {
  height: -30,
  duration: 0.6,
  animationFunction: 'ease',
};

const OnboardingStepsWelcome: React.FC = () => {
  const { stepForward } = useOnboardingContext();

  return (
    <S.Container>
      <FlexCenter column>
        <Animations.FadeDown delay={0} {...fadeConfig}>
          <S.LogoContainer>
            <SvgIcon icon="voiceflowLogomarkLight" size={24} color="#fff" />
          </S.LogoContainer>
        </Animations.FadeDown>

        <Animations.FadeDown delay={0.12} {...fadeConfig}>
          <Title mb={16}>Welcome to Voiceflow</Title>
        </Animations.FadeDown>

        <Animations.FadeDown delay={0.24} {...fadeConfig}>
          <Description width={370} lineHeight={1.47} textAlign="center" mb={40}>
            The collaborative platform to build, launch, and scale AI Agents with your team.
          </Description>
        </Animations.FadeDown>

        <Animations.FadeDown delay={0.36} {...fadeConfig}>
          <FlexCenter>
            <ContinueButton disabled={false} onClick={() => stepForward()}>
              Get Started
            </ContinueButton>
          </FlexCenter>
        </Animations.FadeDown>
      </FlexCenter>
    </S.Container>
  );
};

export default OnboardingStepsWelcome;
