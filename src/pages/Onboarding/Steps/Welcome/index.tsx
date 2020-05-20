import React from 'react';

import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { ConnectedProps } from '@/types';

import { StepID } from '../../constants';
import { Container, Description, Title } from './components';

const Welcome: React.FC<ConnectedWelcomeProps> = ({ user }) => {
  const { actions } = React.useContext(OnboardingContext);

  return (
    <>
      <Container>
        <FlexCenter column>
          <Title>Hi, {user.name}!</Title>

          <Description>
            Welcome to Voiceflow. In the next 3 minutes we’ll get your shared workspace created and walk you through your first project!
          </Description>

          <Button variant="primary" onClick={() => actions.stepForward(StepID.CREATE_WORKSPACE)}>
            Get Started
          </Button>
        </FlexCenter>
      </Container>
    </>
  );
};

const mapStateToProps = {
  user: Account.userSelector,
};

export type ConnectedWelcomeProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps, null)(Welcome);
