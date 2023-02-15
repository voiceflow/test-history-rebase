import { Utils } from '@voiceflow/common';
import { FullSpinner, toast, useSetup } from '@voiceflow/ui';
import React from 'react';
import { useParams } from 'react-router-dom';

import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';

/**
 * @deprecated use ConfirmEmail instead, should be removed when identity service is fully rolled out
 */
const ConfirmEmailLegacy: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const confirmEmailUpdate = useDispatch(Account.confirmEmailUpdate);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const goToLoginPage = useDispatch(Router.goToLogin);
  const goToLogout = useDispatch(Router.goToLogout);
  const [trackingEvents] = useTrackingEvents();

  useSetup(async () => {
    if (token && !isLoggedIn) {
      toast.warn('Login to use link');
      await goToLoginPage();
      return;
    }
    if (!isLoggedIn) return;
    await confirmEmailUpdate(token);
    trackingEvents.trackProfileEmailChanged();
    // Show the success toast before logging out
    await Utils.promise.delay(3000);
    await goToLogout();
  }, []);

  return <FullSpinner message="Verifying Email change" />;
};

export default ConfirmEmailLegacy;
