import React from 'react';

import { Header, InnerContainer, OuterContainer } from './components';
import CurrentStep from './components/CurrentStep';
import { OnboardingProvider } from './context';

const Onboarding: React.FC = () => {
  return (
    <div>
      <OuterContainer>
        <OnboardingProvider>
          <InnerContainer>
            <Header />
            <CurrentStep />
          </InnerContainer>
        </OnboardingProvider>
      </OuterContainer>
    </div>
  );
};

export default Onboarding;
