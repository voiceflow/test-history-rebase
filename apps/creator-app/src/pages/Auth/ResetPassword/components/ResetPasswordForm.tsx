import { Box, Button, ButtonVariant, ClickableText, preventDefault, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks/realtime';

import { PasswordInput } from '../../components';
import { MIN_PASSWORD_LENGTH } from '../../constants';
import { ResetPasswordStage } from '../constants';

export interface ResetPasswordFormProps {
  resetCode: string;
  setStage: (stage: ResetPasswordStage) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ resetCode, setStage }) => {
  const goToLogin = useDispatch(Router.goToLogin);

  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const resetPassword = async () => {
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setStage(ResetPasswordStage.PENDING);

    try {
      await client.identity.user.resetPassword(resetCode, password);

      setStage(ResetPasswordStage.SUCCESSFUL);
    } catch {
      toast.error('Whoops, something went wrong with the server');
      setStage(ResetPasswordStage.FAILED);
    }
  };

  return (
    <form onSubmit={preventDefault(resetPassword)} className="w-100">
      <Box mb={22}>
        <PasswordInput value={password} onChange={setPassword} placeholder="New Password" minLength={MIN_PASSWORD_LENGTH} />
      </Box>
      <Box mb={22}>
        <PasswordInput value={confirm} onChange={setConfirm} name="confirm" placeholder="Confirm Password" isInvalid={password !== confirm} />
      </Box>

      <Box.FlexApart mt={32}>
        <div className="auth__link">
          <ClickableText onClick={() => goToLogin()}>Back to Signing in</ClickableText>
        </div>

        <div>
          <Button variant={ButtonVariant.PRIMARY} type="submit">
            Update Password
          </Button>
        </div>
      </Box.FlexApart>
    </form>
  );
};

export default ResetPasswordForm;
