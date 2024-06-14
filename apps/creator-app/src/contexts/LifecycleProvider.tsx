import { History } from 'history';
import React from 'react';

import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import setupApp from '@/setup';

export interface LifecycleProviderProps extends React.PropsWithChildren {
  history: History;
}

const LifecycleProvider: React.FC<LifecycleProviderProps> = ({ history, children }) => {
  const tabID = useSelector(Session.tabIDSelector);
  const browserID = useSelector(Session.browserIDSelector);

  const logout = useDispatch(Session.logout);

  React.useEffect(() => {
    setupApp({
      tabID,
      logout,
      history,
      browserID,
    });
  }, []);

  return <>{children}</>;
};

export default LifecycleProvider;
