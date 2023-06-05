import { FullSpinner, toast } from '@voiceflow/ui';
import React from 'react';
import { useParams } from 'react-router-dom';

import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import { useAsyncEffect, useDispatch, useSelector } from '@/hooks';

/**
 * @deprecated use ConfirmEmail instead, should be removed when identity service is fully rolled out
 */
const ConfirmAccountLegacy: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const isVerified = useSelector(Account.userVerifiedSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);

  const goToDashboard = useDispatch(Router.goToDashboard);
  const verifySignupEmailToken = useDispatch(Account.verifySignupEmailToken);

  useAsyncEffect(async () => {
    if (isVerified) {
      toast.warn('Email already verified');
    } else if (token) {
      try {
        await verifySignupEmailToken(token);

        const successMessage = isLoggedIn ? 'Email Successfully Verified' : 'Email Successfully Verified, please log in to continue.';

        toast.success(successMessage);
      } catch (e) {
        toast.error('Invalid Verification Link - Expired or Broken');
      }
    }
    goToDashboard();
  }, []);

  return <FullSpinner message="Verifying Account" />;
};

export default ConfirmAccountLegacy;
