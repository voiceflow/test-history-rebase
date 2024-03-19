import { Utils } from '@voiceflow/common';
import { toast, useSetup } from '@voiceflow/ui';
import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';
import { useLocation } from 'react-router-dom';

import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useQuery, useSelector, useTrackingEvents } from '@/hooks';
import { getErrorMessage } from '@/utils/error';

const ConfirmEmail: React.FC = () => {
  const query = useQuery();
  const location = useLocation();
  const [trackingEvents] = useTrackingEvents();

  const isLoggedIn = useSelector(Account.isLoggedInSelector);

  const logout = useDispatch(Session.logout);
  const goToLoginPage = useDispatch(Router.goToLogin);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const verifyUpdateEmailToken = useDispatch(Account.verifyUpdateEmailToken);

  useSetup(async () => {
    const confirmToken = query.get('confirmToken');

    if (!confirmToken) {
      toast.warn('Invalid verification link');

      goToDashboard();
      return;
    }

    if (!isLoggedIn) {
      toast.warn('Login to use confirmation link');

      goToLoginPage('', { redirectTo: `${location.pathname}?confirmToken=${confirmToken}` });
      return;
    }

    try {
      await verifyUpdateEmailToken(confirmToken);

      trackingEvents.trackProfileEmailChanged();

      toast.success('Email successfully updated, log in to continue');

      // Show the success toast before logging out
      await Utils.promise.delay(3000);

      logout();
    } catch (error) {
      toast.error(`Invalid confirmation link: ${getErrorMessage(error, 'expired or broken')}`);

      goToDashboard();
    }
  });

  return <TabLoader />;
};

export default ConfirmEmail;
