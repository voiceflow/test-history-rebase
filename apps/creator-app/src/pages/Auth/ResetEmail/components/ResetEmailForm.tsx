import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ClickableText, isNetworkError, preventDefault, ThemeColor, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Feature from '@/ducks/feature';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks';
import { useSelector } from '@/hooks/redux';
import HeaderBox from '@/pages/Auth/components/HeaderBox';

import { EmailInput } from '../../components';
import { ResetEmailStage } from '../constants';

export interface ResetEmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  setStage: (stage: ResetEmailStage) => void;
}

const ResetEmailForm: React.FC<ResetEmailFormProps> = ({ email, setEmail, setStage }) => {
  const isIdentityUserEnabled = useSelector(Feature.isFeatureEnabledSelector)(Realtime.FeatureFlag.IDENTITY_USER);
  const goToLogin = useDispatch(Router.goToLogin);
  const getSamlLoginURL = useDispatch(Session.getSamlLoginURL);

  const [isSaml, setIsSaml] = React.useState(false);

  const resetEmail = async () => {
    const samlLoginURL = await getSamlLoginURL(email);

    if (samlLoginURL) {
      setIsSaml(true);
      return;
    }

    setStage(ResetEmailStage.PENDING);
    try {
      if (isIdentityUserEnabled) {
        await client.identity.user.resetEmail(email);
      } else {
        await client.user.resetEmail(email);
      }

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

      <EmailInput value={email} onChange={setEmail} error={isSaml} />

      {isSaml && (
        <Box mt={8} fontSize={13} color={ThemeColor.RED}>
          Your email domain is part of an enterprise SSO identity provider. Enter your email on the{' '}
          <ClickableText onClick={() => goToLogin()}>log in page</ClickableText> to continue.
        </Box>
      )}

      <Box.FlexApart mt={32}>
        <div className="auth__link">
          <ClickableText onClick={() => goToLogin()}>Back to log in</ClickableText>
        </div>

        <Button variant={Button.Variant.PRIMARY} type="submit">
          Send Recovery Email
        </Button>
      </Box.FlexApart>
    </form>
  );
};

export default ResetEmailForm;
