import { Vendors } from '@voiceflow/ui';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useIntercom } from 'react-use-intercom';

import { INTERCOM_ENABLED } from '@/config';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { useActiveWorkspace, useFeature, useSelector } from '@/hooks';
import { generateID } from '@/utils/env';
import * as Intercom from '@/vendors/intercom';

export const IntercomChat: React.FC = () => {
  const intercomIntegration = useFeature(FeatureFlag.INTERCOM_INTEGRATION);

  const user = useSelector(Account.userSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const isVisible = useSelector(Session.isIntercomVisibleSelector);
  const intercomUserHMAC = useSelector(Session.intercomUserHMACSelector);
  const workspace = useActiveWorkspace();

  const isRunning = React.useRef(false);
  const intercom = useIntercom();

  const showIntercom = INTERCOM_ENABLED && intercomIntegration.isEnabled && isVisible && !!workspace;

  React.useEffect(() => {
    if (!isLoggedIn) return undefined;

    return () => {
      intercom.shutdown();
      isRunning.current = false;
    };
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (showIntercom) {
      intercom.boot(Intercom.createProps(user, workspace!, intercomUserHMAC));
      Vendors.LogRocket.getSessionURL((sessionURL) => intercom.trackEvent('LogRocket', { sessionURL, company_id: generateID(workspace!.id) }));

      isRunning.current = true;
    } else if (isRunning.current) {
      intercom.shutdown();
    }
  }, [showIntercom]);

  return null;
};

export default IntercomChat;

export const RemoveIntercom = React.memo(() => {
  const dispatch = useDispatch();
  const intercomIntegration = useFeature(FeatureFlag.INTERCOM_INTEGRATION);

  React.useEffect(() => {
    if (!intercomIntegration.isEnabled) return undefined;

    dispatch(Session.hideIntercom());

    return () => {
      dispatch(Session.showIntercom());
    };
  }, []);

  return null;
});
