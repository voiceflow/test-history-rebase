import { UserRole } from '@voiceflow/internal';
import React from 'react';
import type { RouteComponentProps } from 'react-router-dom';

import * as Account from '@/ducks/account';
import { useHideVoiceflowAssistant, useSelector } from '@/hooks';
import * as Query from '@/utils/query';

import { CurrentStep, Header, InnerContainer, OuterContainer } from './components';
import { OnboardingProvider } from './context';

export interface OnboardingProps {
  location?: RouteComponentProps['location'];
  firstTime?: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ location, firstTime = true }) => {
  useHideVoiceflowAssistant();

  const user = useSelector(Account.userSelector);

  const query = Query.parse(location?.search ?? '');

  return (
    <OuterContainer>
      <OnboardingProvider isLoginFlow={firstTime} query={query}>
        <InnerContainer>
          <Header />
          <CurrentStep data={{ collaborators: [{ email: user.email!, permission: UserRole.ADMIN }] }} />
        </InnerContainer>
      </OnboardingProvider>
    </OuterContainer>
  );
};

export default Onboarding;
