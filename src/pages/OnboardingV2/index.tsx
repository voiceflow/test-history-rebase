import queryString from 'query-string';
import React from 'react';

import { UserRole } from '@/constants';
import { userSelector } from '@/ducks/account';
import { connect } from '@/hocs';

import { Header, InnerContainer, OuterContainer } from './components';
import CurrentStep from './components/CurrentStep';
import { OnboardingProvider } from './context';
import { CollaboratorType, OnboardingProps } from './types';

export const Onboarding: React.FC<OnboardingProps> = ({ data, location }) => {
  const query = queryString.parse(location?.search);

  return (
    <div>
      <OuterContainer>
        <OnboardingProvider query={query}>
          <InnerContainer>
            <Header />
            <CurrentStep data={data} />
          </InnerContainer>
        </OnboardingProvider>
      </OuterContainer>
    </div>
  );
};

const mapStateToProps = {
  user: userSelector,
};

type ConnectedOnboardingProps = { user: Record<string, string> };

const ConnectedOnboarding: React.FC<ConnectedOnboardingProps> = ({ user, ...props }) => {
  const data: CollaboratorType = { email: user.email, permission: UserRole.ADMIN };

  return <Onboarding data={data} {...props} />;
};

export default connect(mapStateToProps)(ConnectedOnboarding);
