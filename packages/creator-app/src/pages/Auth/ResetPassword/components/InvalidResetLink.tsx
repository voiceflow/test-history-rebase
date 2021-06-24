import { Box, LegacyButton, NetworkError, preventDefault, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { EmailInput } from '../../components';
import { ResetPasswordStage } from '../constants';

export type InvalidResetLinkProps = {
  setStage: (stage: ResetPasswordStage) => void;
};

const InvalidResetLink: React.FC<InvalidResetLinkProps & ConnectedInvalidResetLinkProps> = ({ goToLogin, setStage }) => {
  const [email, setEmail] = React.useState('');

  const resetEmail = async () => {
    try {
      await client.user.resetEmail(email);

      setStage(ResetPasswordStage.DONE);
    } catch (err) {
      if (err instanceof NetworkError && err.statusCode === 409) {
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
        <Box height={45} mt={32}>
          <div className="float-left auth__link">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={() => goToLogin()}>Back to Signing in</a>
          </div>
          <div className="float-right">
            <LegacyButton isPrimary isBlock type="submit">
              Reset Password
            </LegacyButton>
          </div>
        </Box>
      </form>
    </div>
  );
};

const mapDispatchToProps = {
  goToLogin: Router.goToLogin,
};

type ConnectedInvalidResetLinkProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(InvalidResetLink) as React.FC<InvalidResetLinkProps>;
