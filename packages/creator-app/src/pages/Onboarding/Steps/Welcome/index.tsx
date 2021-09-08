import { Description, FlexCenter, SvgIcon, Title } from '@voiceflow/ui';
import React from 'react';

import ContinueButton from '@/pages/Onboarding/components/ContinueButton';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { FadeDownContainer } from '@/styles/animations';

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
          <FadeDownContainer delay={0} {...fadeConfig}>
            <LogoContainer>
              <SvgIcon icon="voiceflowV" size={24} color="#fff" />
            </LogoContainer>
          </FadeDownContainer>
          <FadeDownContainer delay={0.12} {...fadeConfig}>
            <Title mb={16}>Welcome to Voiceflow</Title>
          </FadeDownContainer>
          <FadeDownContainer delay={0.24} {...fadeConfig}>
            <Description width={370} lineHeight={1.47} textAlign="center" mb={40}>
              Collaboratively design, prototype and build conversational apps across voice and chat channels.
            </Description>
          </FadeDownContainer>
          <FadeDownContainer delay={0.36} {...fadeConfig}>
            <FlexCenter>
              <ContinueButton disabled={false} onClick={() => actions.stepForward(StepID.PERSONALIZE_WORKSPACE)}>
                Get Started
              </ContinueButton>
            </FlexCenter>
          </FadeDownContainer>
        </FlexCenter>
      </Container>
    </>
  );
};

export default Welcome;
