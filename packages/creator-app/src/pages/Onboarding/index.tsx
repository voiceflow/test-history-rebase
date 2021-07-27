import { UserRole } from '@voiceflow/internal';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import InnerContainer from '@/components/CreationSteps/components/Containers/InnerContainer';
import OuterContainer from '@/components/CreationSteps/components/Containers/OuterContainer';
import * as Account from '@/ducks/account';
import { WorkspacesLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';
import * as Query from '@/utils/query';

import { CurrentStep, Header } from './components';
import { OnboardingProvider } from './context';
import { OnboardingDataProps } from './types';

export interface OnboardingProps {
  firstTime?: boolean;
}

export const Onboarding: React.FC<OnboardingProps & RouteComponentProps & ConnectedOnboardingProps> = ({ data, location, firstTime = true }) => {
  const query = Query.parse(location?.search);

  return (
    <OuterContainer>
      <OnboardingProvider isLoginFlow={firstTime} query={query}>
        <InnerContainer>
          <Header />
          <CurrentStep data={data} />
        </InnerContainer>
      </OnboardingProvider>
    </OuterContainer>
  );
};

const mapStateToProps = {
  user: Account.userSelector,
};

const mergeProps = (...[{ user }]: MergeArguments<typeof mapStateToProps>) => ({
  data: {
    collaborators: [{ email: user.email!, permission: UserRole.ADMIN }],
  } as OnboardingDataProps,
});

type ConnectedOnboardingProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default compose(
  connect(mapStateToProps, null, mergeProps),
  withBatchLoadingGate(WorkspacesLoadingGate)
)(Onboarding) as React.FC<OnboardingProps>;
