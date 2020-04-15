import queryString from 'query-string';
import React from 'react';

import { Header, InnerContainer, OuterContainer } from './components';
import CurrentStep from './components/CurrentStep';
import { OnboardingProvider } from './context';

const Onboarding: React.FC<{ location?: any }> = ({ location }) => {
  const query = queryString.parse(location?.search);
  return (
    <div>
      <OuterContainer>
        <OnboardingProvider query={query}>
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
