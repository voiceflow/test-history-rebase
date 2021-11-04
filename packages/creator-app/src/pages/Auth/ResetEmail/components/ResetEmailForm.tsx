import { Box, BoxFlexApart, Button, ButtonVariant, ClickableText, isNetworkError, preventDefault, ThemeColor, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import HeaderBox from '@/pages/Auth/components/HeaderBox';
import { ConnectedProps } from '@/types';

import { EmailInput } from '../../components';
import { SSO_REQUIRED } from '../../constants';
import { getDomainSAML } from '../../hooks';
import { ResetEmailStage } from '../constants';

export interface ResetEmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  setStage: (stage: ResetEmailStage) => void;
}

const ResetEmailForm: React.FC<ResetEmailFormProps & ConnectedResetEmailFormProps> = ({ email, goToLogin, setEmail, setStage }) => {
  const [ssoRequired, setSsoRequired] = React.useState(false);

  const resetEmail = async () => {
    if (await getDomainSAML(email)) {
      setSsoRequired(true);
      return;
    }

    setStage(ResetEmailStage.PENDING);
    try {
      await client.user.resetEmail(email);

      setStage(ResetEmailStage.SUCCESSFUL);
    } catch (err) {
      if (isNetworkError(err) && err.statusCode === 409) {
        toast.error('Too many password reset attempts - Wait 24 hours before the next attempt');
      } else {
        toast.error('Something went wrong, please wait and retry or contact support');
      }

      setStage(ResetEmailStage.IDLE);
    }
  };

  return (
    <form onSubmit={preventDefault(resetEmail)} className="w-100">
      <HeaderBox>
        <h1>Reset password</h1>
      </HeaderBox>
      <EmailInput value={email} onChange={setEmail} error={ssoRequired} />
      {ssoRequired && (
        <Box mt={8} fontSize={13} color={ThemeColor.RED}>
          {SSO_REQUIRED}
        </Box>
      )}

      <BoxFlexApart mt={32}>
        <div className="auth__link">
          <ClickableText onClick={() => goToLogin()}>Back to log in</ClickableText>
        </div>
        <Button variant={ButtonVariant.PRIMARY} type="submit">
          Send Recovery Email
        </Button>
      </BoxFlexApart>
    </form>
  );
};

const mapDispatchToProps = {
  goToLogin: Router.goToLogin,
};

type ConnectedResetEmailFormProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(ResetEmailForm) as React.FC<ResetEmailFormProps>;
