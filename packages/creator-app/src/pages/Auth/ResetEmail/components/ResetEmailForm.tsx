import React from 'react';

import client from '@/client';
import { NetworkError } from '@/client/fetch';
import Box from '@/components/Box';
import Button from '@/components/LegacyButton';
import { toast } from '@/components/Toast';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { preventDefault } from '@/utils/dom';

import { EmailInput } from '../../components';
import { ResetEmailStage } from '../constants';

export type ResetEmailFormProps = {
  email: string;
  setEmail: (email: string) => void;
  setStage: (stage: ResetEmailStage) => void;
};

const ResetEmailForm: React.FC<ResetEmailFormProps & ConnectedResetEmailFormProps> = ({ email, goToLogin, setEmail, setStage }) => {
  const resetEmail = async () => {
    setStage(ResetEmailStage.PENDING);

    try {
      await client.user.resetEmail(email);

      setStage(ResetEmailStage.SUCCESSFUL);
    } catch (err) {
      if (err instanceof NetworkError && err.statusCode === 409) {
        toast.error('Too many password reset attempts - Wait 24 hours before the next attempt');
      } else {
        toast.error('Something went wrong, please wait and retry or contact support');
      }

      setStage(ResetEmailStage.IDLE);
    }
  };

  return (
    <form onSubmit={preventDefault(resetEmail)} className="w-100">
      <EmailInput value={email} onChange={setEmail} />
      <Box height={45} mt={32}>
        <div className="float-left auth__link">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a onClick={() => goToLogin()}>Back to Signing in</a>
        </div>
        <div className="float-right">
          <Button isPrimary isBlock type="submit">
            Reset Password
          </Button>
        </div>
      </Box>
    </form>
  );
};

const mapDispatchToProps = {
  goToLogin: Router.goToLogin,
};

type ConnectedResetEmailFormProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ResetEmailForm) as React.FC<ResetEmailFormProps>;
