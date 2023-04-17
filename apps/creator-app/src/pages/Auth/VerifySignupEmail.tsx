import { FullSpinner, toast } from '@voiceflow/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';

import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import { useAsyncEffect, useDispatch, useQuery, useSelector } from '@/hooks';
import { getErrorMessage } from '@/utils/error';

const VerifySignupEmail: React.FC = () => {
  const query = useQuery();
  const location = useLocation();

  const isVerified = useSelector(Account.userVerifiedSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);

  const goToLoginPage = useDispatch(Router.goToLogin);
  const goToOnboarding = useDispatch(Router.goToOnboarding);
  const verifySignupEmailToken = useDispatch(Account.verifySignupEmailToken);

  useAsyncEffect(async () => {
    const verificationToken = query.get('verificationToken');

    query.delete('verificationToken');

    const search = `?${query.toString()}`;

    if (!verificationToken) {
      toast.warn('Invalid verification link');

      goToOnboarding(search);
      return;
    }

    if (!isLoggedIn) {
      toast.warn('Login to use verification link');

      goToLoginPage(search, { redirectTo: `${location.pathname}?verificationToken=${verificationToken}` });
      return;
    }

    if (isVerified) {
      toast.warn('Email already verified');

      goToOnboarding(search);
      return;
    }

    try {
      await verifySignupEmailToken(verificationToken);

      toast.success('Email Successfully Verified');
    } catch (error) {
      toast.error(`Invalid verification link: ${getErrorMessage(error, 'expired or broken')}`);
    }

    goToOnboarding(search);
  });

  return <FullSpinner message="Verifying Account" />;
};

export default VerifySignupEmail;
