import { useSetup } from '@voiceflow/ui';
import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks';

function Logout() {
  const logout = useDispatch(Session.logout);

  useSetup(() => {
    logout();
  });

  return <TabLoader />;
}

export default Logout;
