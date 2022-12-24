import { Box, BoxFlexApart, Button, ButtonVariant, ClickableText, preventDefault, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs/connect';
import { ConnectedProps } from '@/types';

import { PasswordInput } from '../../components';
import { MIN_PASSWORD_LENGTH } from '../../constants';
import { ResetPasswordStage } from '../constants';

export interface ResetPasswordFormProps {
  resetCode: string;
  setStage: (stage: ResetPasswordStage) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps & ConnectedResetPasswordFormProps> = ({ resetCode, goToLogin, setStage }) => {
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const resetPassword = async () => {
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setStage(ResetPasswordStage.PENDING);

    try {
      await client.user.resetPassword(resetCode, password);

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

      <BoxFlexApart mt={32}>
        <div className="auth__link">
          <ClickableText onClick={() => goToLogin()}>Back to Signing in</ClickableText>
        </div>

        <div>
          <Button variant={ButtonVariant.PRIMARY} type="submit">
            Update Password
          </Button>
        </div>
      </BoxFlexApart>
    </form>
  );
};

const mapDispatchToProps = {
  goToLogin: Router.goToLogin,
};

type ConnectedResetPasswordFormProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ResetPasswordForm) as React.FC<ResetPasswordFormProps>;
