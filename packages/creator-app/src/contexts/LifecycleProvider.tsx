import { History } from 'history';
import React from 'react';

import * as Session from '@/ducks/session';
import { connect } from '@/hocs/connect';
import setupApp from '@/setup';
import { ConnectedProps } from '@/types';

export interface LifecycleProviderProps {
  history: History;
}

const LifecycleProvider: React.FC<LifecycleProviderProps & ConnectedLifecycleProviderProps> = ({ history, browserID, tabID, children, logout }) => {
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

const mapStateToProps = {
  tabID: Session.tabIDSelector,
  browserID: Session.browserIDSelector,
};

const mapDispatchToProps = {
  logout: Session.logout,
};

type ConnectedLifecycleProviderProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(LifecycleProvider) as React.FC<LifecycleProviderProps>;
