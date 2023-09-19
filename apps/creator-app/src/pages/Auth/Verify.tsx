import { Box, ClickableText } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { wordmark } from '@/assets';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { useDispatch, useHideVoiceflowAssistant, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';
import * as Query from '@/utils/query';

import Card from './components/Card';
import Container from './components/Container';
import Title from './components/Title';

const Verify: React.FC = () => {
  useHideVoiceflowAssistant();

  const email = useSelector(Account.userEmailSelector);
  const location = useLocation();

  const logout = useDispatch(Session.logout);
  const resendVerificationEmail = useDispatch(Account.resendSignupVerificationEmail);

  const onResendEmail = async () => {
    try {
      await resendVerificationEmail({ query: Query.parse(location.search) });

      toast.success("We've sent a new confirmation link to your email");
    } catch (error) {
      toast.error('too many attempts, please try again later');
    }
  };

  return (
    <Container>
      <Box as="img" src={wordmark} height={35} />

      <Card>
        <Title id={Identifier.VERIFY_EMAIL_TITLE}>Verify your email</Title>

        <p>
          To use Voiceflow, click the verify button we sent in an email to <strong>{email}</strong>. This helps keep your account secure.
        </p>

        <p>
          No email in your inbox or spam folder? <ClickableText onClick={onResendEmail}>Resend verification email</ClickableText>.
        </p>

        <span>
          Wrong account? <ClickableText onClick={logout}>Log out</ClickableText> to sign in again.
        </span>
      </Card>
    </Container>
  );
};

export default Verify;
