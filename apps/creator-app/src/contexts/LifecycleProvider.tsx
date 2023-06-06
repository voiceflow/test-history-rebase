import { History } from 'history';
import React from 'react';

import * as Session from '@/ducks/session';
import { useDispatch } from '@/hooks/realtime';
import setupApp from '@/setup';

export interface LifecycleProviderProps {
  history: History;
  children: React.ReactNode;
}

const LifecycleProvider: React.FC<LifecycleProviderProps> = ({ history, children }) => {
  const logout = useDispatch(Session.logout);

  React.useEffect(() => {
    setupApp({ logout, history });
  }, []);

  return <>{children}</>;
};

export default LifecycleProvider;
