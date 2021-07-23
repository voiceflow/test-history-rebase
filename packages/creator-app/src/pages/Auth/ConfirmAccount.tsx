import { FullSpinner, toast } from '@voiceflow/ui';
import React from 'react';
import { useParams } from 'react-router-dom';

import * as Account from '@/ducks/account';
import * as Recent from '@/ducks/recent';
import * as Router from '@/ducks/router';
import { useAsyncEffect, useDispatch, useSelector } from '@/hooks';

const ConfirmAccount: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const isVerified = useSelector(Account.userVerifiedSelector);
  const redirect = useSelector(Recent.recentRedirectSelector);

  const confirmAccount = useDispatch(Account.confirmAccount);
  const goToOnboarding = useDispatch(Router.goToOnboarding);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const redirectTo = useDispatch(Router.redirectTo);

  useAsyncEffect(async () => {
    if (isVerified) {
      toast.warn('Email already verified');
      goToDashboard();
      return;
    }

    if (token) {
      await confirmAccount(token)
        .then(() => toast.success('Email Successfully Verified'))
        .catch(() => toast.error('Invalid Verification Link - Expired or Broken'));
    }

    if (redirect) {
      redirectTo(redirect);
    } else {
      goToOnboarding();
    }
  }, []);

  return <FullSpinner message="Verifying Account" />;
};

export default ConfirmAccount;
