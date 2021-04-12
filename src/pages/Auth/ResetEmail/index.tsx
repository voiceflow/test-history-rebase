import React from 'react';

import { Spinner } from '@/components/Spinner';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { AuthBox, AuthenticationContainer } from '../components';
import { ResetEmailForm } from './components';
import { ResetEmailStage } from './constants';

const ResetEmail: React.FC<ConnectedResetEmailProps> = ({ goToLogin }) => {
  const [email, setEmail] = React.useState('');
  const [stage, setStage] = React.useState(ResetEmailStage.IDLE);

  const stages = {
    [ResetEmailStage.IDLE]: <ResetEmailForm email={email} setEmail={setEmail} setStage={setStage} />,

    [ResetEmailStage.PENDING]: <Spinner message="Sending Email" />,

    [ResetEmailStage.SUCCESSFUL]: (
      <>
        <div className="confirm-helper">
          The confirmation link has been sent to {email}. If it doesn't appear within a few minutes, check your spam folder.
        </div>
        <div className="auth__link">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={() => goToLogin()}>Back to Signing in</a>
        </div>
      </>
    ),
  };

  return (
    <AuthenticationContainer>
      <AuthBox>
        <div className="auth-form-wrapper">{stages[stage] ?? null}</div>
      </AuthBox>
    </AuthenticationContainer>
  );
};

const mapDispatchToProps = {
  goToLogin: Router.goToLogin,
};

type ConnectedResetEmailProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ResetEmail);
