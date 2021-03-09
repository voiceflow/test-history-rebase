import React from 'react';
import { FormGroup } from 'reactstrap';

import client from '@/client';
import Button from '@/components/LegacyButton';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { preventDefault } from '@/utils/dom';

import { PasswordInput } from '../../components';
import { ResetPasswordStage } from '../constants';

export type ResetPasswordFormProps = {
  resetCode: string;
  setStage: (stage: ResetPasswordStage) => void;
  setError: (error: string) => void;
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps & ConnectedResetPasswordFormProps> = ({ resetCode, goToLogin, setStage, setError }) => {
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const resetPassword = async () => {
    if (password !== confirm) {
      return setError('Passwords do not match');
    }

    setStage(ResetPasswordStage.PENDING);

    try {
      await client.user.resetPassword(resetCode, password);

      setStage(ResetPasswordStage.SUCCESSFUL);
    } catch {
      setError('Whoops, something went wrong with the server');
      setStage(ResetPasswordStage.FAILED);
    }
  };

  return (
    <form onSubmit={preventDefault(resetPassword)} className="w-100">
      <FormGroup>
        <PasswordInput value={password} onChange={setPassword} placeholder="New Password" />
      </FormGroup>
      <FormGroup>
        <PasswordInput value={confirm} onChange={setConfirm} name="confirm" placeholder="Confirm Password" isInvalid={password !== confirm} />
      </FormGroup>
      <div style={{ height: '45px', marginTop: '32px' }}>
        <div className="float-left auth__link">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={() => goToLogin()}>Back to Signing in</a>
        </div>
        <div className="float-right">
          <Button isPrimary isBlock type="submit">
            Update Password
          </Button>
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
