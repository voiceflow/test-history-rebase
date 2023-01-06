import { Box, Button, ButtonVariant, ClickableText, isNetworkError, preventDefault, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks/realtime';

import { EmailInput } from '../../components';
import { ResetPasswordStage } from '../constants';

export interface InvalidResetLinkProps {
  setStage: (stage: ResetPasswordStage) => void;
}

const InvalidResetLink: React.FC<InvalidResetLinkProps> = ({ setStage }) => {
  const goToLogin = useDispatch(Router.goToLogin);

  const [email, setEmail] = React.useState('');

  const resetEmail = async () => {
    try {
      await client.user.resetEmail(email);

      setStage(ResetPasswordStage.DONE);
    } catch (err) {
      if (isNetworkError(err) && err.statusCode === 409) {
        toast.error('Too many password reset attempts - Wait 24 hours before the next attempt');
      } else {
        toast.error('Something went wrong, please wait and retry or contact support');
      }

      setStage(ResetPasswordStage.FAILED);
    }
  };

  return (
    <div>
      <div className="confirm-helper">The password reset link has expired or is invalid. Please enter your email below to start again.</div>
      <form onSubmit={preventDefault(resetEmail)} className="w-100">
        <Box mt={8}>
          <EmailInput value={email} onChange={setEmail} />
        </Box>

        <Box.FlexApart mt={32}>
          <div className="auth__link">
            <ClickableText onClick={() => goToLogin()}>Back to Signing in</ClickableText>
          </div>

          <div>
            <Button variant={ButtonVariant.PRIMARY} type="submit">
              Reset Password
            </Button>
          </div>
        </Box.FlexApart>
      </form>
    </div>
  );
};

export default InvalidResetLink;
