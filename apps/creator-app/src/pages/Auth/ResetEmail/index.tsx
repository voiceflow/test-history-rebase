import { ClickableText, Spinner } from '@voiceflow/ui';
import React from 'react';

import { voiceflowWordmarkDark } from '@/assets';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks/realtime';

import { AuthBox, AuthenticationContainer } from '../components';
import { ResetEmailForm } from './components';
import { ResetEmailStage } from './constants';

const ResetEmail: React.FC = () => {
  const goToLogin = useDispatch(Router.goToLogin);

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

        <div style={{ marginTop: '32px' }} className="auth__link">
          <ClickableText onClick={() => goToLogin()}>Back to Signing in</ClickableText>
        </div>
      </>
    ),
  };

  return (
    <AuthenticationContainer>
      <AuthBox>
        <img className="auth-logo" src={voiceflowWordmarkDark} alt="logo" />
        <div className="auth-form-wrapper">{stages[stage] ?? null}</div>
      </AuthBox>
    </AuthenticationContainer>
  );
};

export default ResetEmail;
