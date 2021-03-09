import React from 'react';
import { FormGroup } from 'reactstrap';

import client from '@/client';
import { NetworkError } from '@/client/fetch';
import Button from '@/components/LegacyButton';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { preventDefault } from '@/utils/dom';

import { EmailInput } from '../../components';
import { ResetPasswordStage } from '../constants';

export type InvalidResetLinkProps = {
  setStage: (stage: ResetPasswordStage) => void;
  setError: (error: string) => void;
};

const InvalidResetLink: React.FC<InvalidResetLinkProps & ConnectedInvalidResetLinkProps> = ({ goToLogin, setStage, setError }) => {
  const [email, setEmail] = React.useState('');

  const resetEmail = async () => {
    try {
      await client.user.resetEmail(email);

      setStage(ResetPasswordStage.DONE);
    } catch (err) {
      if (err instanceof NetworkError && err.statusCode === 409) {
        setError('Too many password reset attempts - Wait 24 hours before the next attempt');
      } else {
        setError('Something went wrong, please wait and retry or contact support');
      }

      setStage(ResetPasswordStage.FAILED);
    }
  };

  return (
    <div>
      <div className="confirm-helper">The password reset link has expired or is invalid. Please enter your email below to start again.</div>
      <form onSubmit={preventDefault(resetEmail)} className="w-100">
        <FormGroup>
          <EmailInput value={email} onChange={setEmail} />
        </FormGroup>
        <div style={{ height: '45px', marginTop: '32px' }}>
          <div className="float-left auth__link">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={() => goToLogin()}>Back to Signing in</a>
          </div>
          <div className="float-right">
            <Button isPrimary isBlock type="submit">
              Reset Password
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapDispatchToProps = {
  goToLogin: Router.goToLogin,
};

type ConnectedInvalidResetLinkProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(InvalidResetLink) as React.FC<InvalidResetLinkProps>;
