import { Animations, Description, FlexCenter, SvgIcon, Title } from '@voiceflow/ui';
import React from 'react';

import ContinueButton from '@/pages/Onboarding/components/ContinueButton';
import { OnboardingContext } from '@/pages/Onboarding/context';

import { StepID } from '../../constants';
import { Container, LogoContainer } from './components';

const fadeConfig = {
  height: -30,
  duration: 0.6,
  animationFunction: 'ease',
};

const Welcome: React.FC = () => {
  const { actions } = React.useContext(OnboardingContext);

  return (
    <>
      <Container>
        <FlexCenter column>
          <Animations.FadeDown delay={0} {...fadeConfig}>
            <LogoContainer>
              <SvgIcon icon="voiceflowLogomarkLight" size={24} color="#fff" />
            </LogoContainer>
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
              <ContinueButton disabled={false} onClick={() => actions.stepForward(StepID.PERSONALIZE_WORKSPACE)}>
                Get Started
              </ContinueButton>
            </FlexCenter>
          </Animations.FadeDown>
        </FlexCenter>
      </Container>
    </>
  );
};

export default Welcome;
