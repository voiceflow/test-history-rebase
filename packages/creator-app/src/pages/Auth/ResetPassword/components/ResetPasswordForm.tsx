import { Box, LegacyButton, preventDefault, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { PasswordInput } from '../../components';
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
        <PasswordInput value={password} onChange={setPassword} placeholder="New Password" />
      </Box>
      <Box mb={22}>
        <PasswordInput value={confirm} onChange={setConfirm} name="confirm" placeholder="Confirm Password" isInvalid={password !== confirm} />
      </Box>
      <div style={{ height: '45px', marginTop: '32px' }}>
        <div className="float-left auth__link">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={() => goToLogin()}>Back to Signing in</a>
        </div>
        <div className="float-right">
          <LegacyButton isPrimary isBlock type="submit">
            Update Password
          </LegacyButton>
        </div>
      </div>
    </form>
  );
};

const mapDispatchToProps = {
  goToLogin: Router.goToLogin,
};

type ConnectedResetPasswordFormProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ResetPasswordForm) as React.FC<ResetPasswordFormProps>;
