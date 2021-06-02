import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import client from '@/client';
import { NetworkError } from '@/client/fetch';
import { Spinner } from '@/components/Spinner';
import { toast } from '@/components/Toast';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useAsyncMountUnmount } from '@/hooks';
import { ConnectedProps } from '@/types';

import { AuthBox, AuthenticationContainer } from '../components';
import { InvalidResetLink, ResetPasswordForm } from './components';
import { ResetPasswordStage } from './constants';

const ResetPassword: React.FC<RouteComponentProps<{ id: string }> & ConnectedResetPasswordProps> = ({ match, goToLogin }) => {
  const [stage, setStage] = React.useState(ResetPasswordStage.VALIDATING);

  const stages = {
    [ResetPasswordStage.VALIDATING]: <Spinner message="Checking token" />,

    [ResetPasswordStage.IDLE]: <ResetPasswordForm resetCode={match.params.id} setStage={setStage} />,

    [ResetPasswordStage.PENDING]: <Spinner message="Reseting Password" />,

    [ResetPasswordStage.SUCCESSFUL]: (
      <div className="text-center">
        <div className="confirm-helper">Your Password Has Been Reset</div>
        <div style={{ marginTop: '32px' }}>
          <div className="auth__link">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={() => goToLogin()}>Back to Signing in</a>
          </div>
        </div>
      </div>
    ),

    [ResetPasswordStage.FAILED]: <InvalidResetLink setStage={setStage} />,

    [ResetPasswordStage.DONE]: (
      <>
        <div className="confirm-helper">
          The confirmation link has been sent to name@domain.com. If it doesn't appear within a few minutes, check your spam folder.
        </div>
        <div className="auth__link">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={() => goToLogin()}>Back to Signing in</a>
        </div>
      </>
    ),
  };

  useAsyncMountUnmount(async () => {
    try {
      await client.user.testResetPassword(match.params.id);

      setStage(ResetPasswordStage.IDLE);
    } catch (err) {
      if (!(err instanceof NetworkError) || err.statusCode >= 500) {
        toast.error('Whoops, something went wrong with the server');
      }
      setStage(ResetPasswordStage.FAILED);
    }
  });

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

type ConnectedResetPasswordProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ResetPassword);
