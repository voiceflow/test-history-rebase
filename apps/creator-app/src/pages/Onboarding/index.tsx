import React from 'react';
import type { RouteComponentProps } from 'react-router-dom';

import { useHideVoiceflowAssistant } from '@/hooks';
import * as Query from '@/utils/query';

import { Header, InnerContainer, OuterContainer } from './components';
import { OnboardingProvider } from './context';
import CurrentStep from './CurrentStep';

export interface OnboardingProps {
  location?: RouteComponentProps['location'];
}

export const Onboarding: React.FC<OnboardingProps> = ({ location }) => {
  useHideVoiceflowAssistant();

  const query = React.useMemo(() => Query.parse(location?.search ?? ''), [location?.search]);

  return (
    <OuterContainer>
      <OnboardingProvider query={query}>
        <InnerContainer>
          <Header />
          <CurrentStep />
        </InnerContainer>
      </OnboardingProvider>
    </OuterContainer>
  );
};

export default Onboarding;
