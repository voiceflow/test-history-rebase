import { FullSpinner, useSetup } from '@voiceflow/ui';
import React from 'react';

import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks';

function Logout() {
  const logout = useDispatch(Session.logout);

  useSetup(() => {
    logout();
  });

  return <FullSpinner message="Logging out" />;
}

export default Logout;
