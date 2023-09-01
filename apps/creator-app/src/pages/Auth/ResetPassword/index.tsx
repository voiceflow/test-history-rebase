import { ClickableText, isNetworkError, Spinner, toast } from '@voiceflow/ui';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import client from '@/client';
import * as Router from '@/ducks/router';
import { useAsyncMountUnmount } from '@/hooks';
import { useDispatch } from '@/hooks/realtime';

import { AuthBox, AuthenticationContainer } from '../components';
import { InvalidResetLink, ResetPasswordForm } from './components';
import { ResetPasswordStage } from './constants';

const ResetPassword: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const goToLogin = useDispatch(Router.goToLogin);

  const [stage, setStage] = React.useState(ResetPasswordStage.VALIDATING);

  const stages = {
    [ResetPasswordStage.VALIDATING]: <Spinner message="Checking token" />,

    [ResetPasswordStage.IDLE]: <ResetPasswordForm resetCode={match.params.id} setStage={setStage} />,

    [ResetPasswordStage.PENDING]: <Spinner message="Reseting Password" />,

    [ResetPasswordStage.SUCCESSFUL]: (
      <div className="text-center">
        <div className="confirm-helper">Your Password Has Been Reset</div>

        <div style={{ marginTop: '32px' }} className="auth__link">
          <ClickableText onClick={() => goToLogin()}>Back to Signing in</ClickableText>
        </div>
      </div>
    ),

    [ResetPasswordStage.FAILED]: <InvalidResetLink setStage={setStage} />,

    [ResetPasswordStage.DONE]: (
      <>
        <div className="confirm-helper">The confirmation link has been sent. If it doesn't appear within a few minutes, check your spam folder.</div>

        <div style={{ marginTop: '32px' }} className="auth__link">
          <ClickableText onClick={() => goToLogin()}>Back to Signing in</ClickableText>
        </div>
      </>
    ),
  };

  useAsyncMountUnmount(async () => {
    try {
      await client.identity.user.testResetPassword(match.params.id);

      setStage(ResetPasswordStage.IDLE);
    } catch (err) {
      if (!isNetworkError(err) || err.statusCode >= 500) {
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

export default ResetPassword;
