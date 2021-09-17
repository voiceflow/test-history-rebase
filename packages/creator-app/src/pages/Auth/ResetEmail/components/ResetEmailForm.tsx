import { BoxFlexApart, Button, ButtonVariant, ClickableText, NetworkError, preventDefault, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { EmailInput } from '../../components';
import { ResetEmailStage } from '../constants';

export interface ResetEmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  setStage: (stage: ResetEmailStage) => void;
}

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

      <BoxFlexApart mt={32}>
        <div className="auth__link">
          <ClickableText onClick={() => goToLogin()}>Back to Signing in</ClickableText>
        </div>

        <div>
          <Button variant={ButtonVariant.PRIMARY} type="submit">
            Reset Password
          </Button>
        </div>
      </BoxFlexApart>
    </form>
  );
};

const mapDispatchToProps = {
  goToLogin: Router.goToLogin,
};

type ConnectedResetEmailFormProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ResetEmailForm) as React.FC<ResetEmailFormProps>;
