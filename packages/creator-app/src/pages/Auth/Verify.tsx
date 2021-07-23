import { Box, ClickableText, toast } from '@voiceflow/ui';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { wordmark } from '@/assets';
import client from '@/client';
import * as Account from '@/ducks/account';
import * as Recent from '@/ducks/recent';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import Card from './components/Card';
import Container from './components/Container';
import Title from './components/Title';

const Verify: React.FC = () => {
  const email = useSelector(Account.userEmailSelector);

  const logout = useDispatch(Session.logout);
  const setRedirect = useDispatch(Recent.updateRecentRedirect);

  const handleResendEmail = useCallback(async () => {
    try {
      await client.user.resendConfirmationEmail();
      toast.success("We've sent a new confirmation link to your email");
    } catch (error) {
      toast.error('too many attempts, please try again later');
    }
  }, []);

  const history = useHistory();

  React.useEffect(() => {
    const { pathname, search = '' } = history.location;
    setRedirect(`${pathname}${search}` || null);
  }, []);

  return (
    <Container>
      <Box as="img" src={wordmark} height={35} />
      <Card>
        <Title id={Identifier.VERIFY_EMAIL_TITLE}>Verify your email</Title>
        <p>
          To use Voiceflow, click the verify button we sent in an email to <strong>{email}</strong>. This helps keep your account secure.
        </p>
        <p>
          No email in your inbox or spam folder? <ClickableText onClick={handleResendEmail}>Resend verification email</ClickableText>.
        </p>
        <span>
          Wrong account? <ClickableText onClick={logout}>Log out</ClickableText> to sign in again.
        </span>
      </Card>
    </Container>
  );
};

export default Verify;
