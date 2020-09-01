import queryString from 'query-string';
import React from 'react';

import InnerContainer from '@/components/CreationSteps/components/Containers/InnerContainer';
import OuterContainer from '@/components/CreationSteps/components/Containers/OuterContainer';
import { UserRole } from '@/constants';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { CurrentStep, Header } from './components';
import { OnboardingProvider } from './context';
import { OnboardingDataProps, OnboardingProps } from './types';

export const Onboarding: React.FC<OnboardingProps> = ({ data, location, firstTime = true }) => {
  const query = queryString.parse(location?.search);
  return (
    <div>
      <OuterContainer>
        <OnboardingProvider isLoginFlow={firstTime} query={query}>
          <InnerContainer>
            <Header />
            <CurrentStep data={data} />
          </InnerContainer>
        </OnboardingProvider>
      </OuterContainer>
    </div>
  );
};

const ConnectedOnboarding: React.FC<ConnectedOnboardingProps> = ({ user, ...props }) => {
  const data: OnboardingDataProps = {
    collaborators: [{ email: user.email!, permission: UserRole.ADMIN }],
  };

  return <Onboarding data={data} {...props} />;
};

const mapStateToProps = {
  user: Account.userSelector,
};

type ConnectedOnboardingProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ConnectedOnboarding);
