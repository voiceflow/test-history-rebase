import { useClient } from '@logux/client/react';
import { Utils } from '@voiceflow/common';
import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { withFeatureGate } from '@/hocs';
import { useBeforeUnload, useSelector, useSetup, useStore, useTeardown } from '@/hooks';

import ConnectionWarning from './RealtimeLoadingGate/components/RealtimeConnectionWarning';

/**
 * manages connection to realtime service
 */
const RealtimeConnectionGate: React.FC = ({ children }) => {
  const client = useClient();
  const store = useStore();
  const userID = useSelector(Account.userIDSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const authToken = useSelector(Session.authTokenSelector);

  const [isSynchronized, setSynchronized] = React.useState(false);
  const [isConnected, setConnected] = React.useState(false);
  const unsubscribeRef = React.useRef(Utils.functional.noop);

  useSetup(() => {
    if (client.connected) return;

    client.start();

    client.node.catch((err) => {
      if (err.description === 'Wrong credentials') {
        const isLoggedIn = Account.isLoggedInSelector(store.getState());

        if (isLoggedIn) {
          throw new Error('failed to authenticate against realtime service');
        } else {
          // not an error state if user is logged out
          return;
        }
      }

      // eslint-disable-next-line no-console
      console.error(err);
    });
  });

  useTeardown(() => {
    unsubscribeRef.current();
  });

  useBeforeUnload(client.destroy);

  React.useEffect(() => {
    if (isLoggedIn) {
      unsubscribeRef.current = client.on('state', () => setConnected(client.connected));

      client.changeUser(String(userID), authToken!);

      // eslint-disable-next-line promise/catch-or-return
      client.waitFor('synchronized').then(() => setSynchronized(true));
    } else {
      // allow anonymous connections when logged out
      setConnected(true);
      setSynchronized(true);
    }

    return () => {
      setSynchronized(false);
    };
  }, [isLoggedIn]);

  return (
    <LoadingGate label="Collaboration" isLoaded={isSynchronized}>
      {isConnected ? children : <ConnectionWarning />}
    </LoadingGate>
  );
};

export default withFeatureGate(FeatureFlag.ATOMIC_ACTIONS)(RealtimeConnectionGate);
