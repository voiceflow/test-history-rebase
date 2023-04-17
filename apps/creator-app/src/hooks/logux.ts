import React from 'react';

import LoguxClient, { ClientEvents } from '@/client/logux';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { useTeardown } from '@/hooks/lifecycle';
import { useSelector, useStore } from '@/hooks/redux';
import logger from '@/utils/logger';

export const useLoguxSetup = (client: LoguxClient, { onLogout, onLogoutFail }: { onLogout?: VoidFunction; onLogoutFail?: VoidFunction } = {}) => {
  const store = useStore();

  const userID = useSelector(Account.userIDSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const authToken = useSelector(Session.authTokenSelector);

  const teardownClient = React.useRef<VoidFunction | null>(null);

  React.useEffect(
    () =>
      client.on(ClientEvents.WRONG_CREDENTIALS, () => {
        const isLoggedIn = Account.isLoggedInSelector(store.getState());

        if (isLoggedIn) {
          throw new Error('failed to authenticate against logux service');
        }
      }),
    []
  );

  React.useEffect(() => {
    if (!isLoggedIn) return undefined;

    client.changeUser(String(userID), authToken!);

    // only start the client once we've set the initial user
    if (!teardownClient.current) {
      teardownClient.current = client.start();
    }

    return () => {
      onLogout?.();

      client.logout().catch(() => {
        logger.error('error occurred during logout');
        onLogoutFail?.();
      });
    };
  }, [isLoggedIn]);

  useTeardown(() => {
    const teardown = teardownClient.current;

    teardownClient.current = null;
    teardown?.();
  });
};
