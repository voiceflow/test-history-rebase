import queryString from 'query-string';
import React from 'react';

import InnerContainer from '@/components/CreationSteps/components/Containers/InnerContainer';
import OuterContainer from '@/components/CreationSteps/components/Containers/OuterContainer';
import { UserRole } from '@/constants';
import * as Account from '@/ducks/account';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { CurrentStep, Header } from './components';
import { OnboardingProvider } from './context';
import { OnboardingDataProps, OnboardingProps } from './types';

export const Onboarding: React.FC<OnboardingProps> = ({ fetchWorkspaces, data, location, firstTime = true }) => {
  const query = queryString.parse(location?.search);
  const [finishedFetchingWorkspaces, setFinishedFetchingWorkspaces] = React.useState(false);

  const fetchWorkspacesFunc = async () => {
    await fetchWorkspaces?.();
    setFinishedFetchingWorkspaces(true);
  };

  React.useEffect(() => {
    fetchWorkspacesFunc();
  });

  return finishedFetchingWorkspaces ? (
    <OuterContainer>
      <OnboardingProvider isLoginFlow={firstTime} query={query}>
        <InnerContainer>
          <Header />
          <CurrentStep data={data} />
        </InnerContainer>
      </OnboardingProvider>
    </OuterContainer>
  ) : null;
};

const ConnectedOnboarding: React.FC<ConnectedOnboardingProps> = ({ fetchWorkspaces, user, ...props }) => {
  const data: OnboardingDataProps = {
    collaborators: [{ email: user.email!, permission: UserRole.ADMIN }],
  };

  return <Onboarding data={data} fetchWorkspaces={fetchWorkspaces} {...props} />;
};

const mapStateToProps = {
  user: Account.userSelector,
};

const mapDispatchToProps = {
  fetchWorkspaces: Workspace.fetchWorkspaces,
};

type ConnectedOnboardingProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedOnboarding) as React.FC<Omit<OnboardingProps, 'data'>>;
