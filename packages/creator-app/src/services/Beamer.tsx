import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Account from '@/ducks/account';
import { useFeature, useSelector } from '@/hooks';
import * as BeamerClient from '@/vendors/beamerClient';

const Beamer: React.FC = () => {
  const user = useSelector(Account.userSelector);

  const beamerApp = useFeature(Realtime.FeatureFlag.BEAMER_APP);

  React.useEffect(() => {
    if (!beamerApp.isEnabled) return undefined;

    // TODO: move initialization to a setup.ts file when FF is removed
    BeamerClient.initialize();

    return () => {
      // TODO: remove destroy when FF is removed
      BeamerClient.destroy();
    };
  }, [beamerApp.isEnabled]);

  React.useEffect(() => {
    if (!beamerApp.isEnabled) return;

    const [firstName, ...lastName] = user?.name ? user.name.split(' ') : ['', ''];

    BeamerClient.updateParameters({
      user_id: user?.creator_id ? String(user.creator_id) : '',
      user_email: user?.email ?? '',
      user_lastname: lastName.join(' '),
      user_firstname: firstName,
      user_created_at: user?.created ?? '',
    });
  }, [user?.creator_id, user?.email, user?.name, user?.created, beamerApp.isEnabled]);

  return null;
};

export default React.memo(Beamer);
