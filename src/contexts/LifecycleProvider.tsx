import { History } from 'history';
import React from 'react';

import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import setupApp from '@/setup';
import { ConnectedProps } from '@/types';

export type LifecycleProviderProps = {
  history: History;
};

const LifecycleProvider: React.FC<LifecycleProviderProps & ConnectedLifecycleProviderProps> = ({ history, browserID, tabID, children }) => {
  React.useEffect(() => {
    setupApp(history, browserID, tabID);
  }, []);

  return <>{children}</>;
};

const mapStateToProps = {
  browserID: Session.browserIDSelector,
  tabID: Session.tabIDSelector,
};

type ConnectedLifecycleProviderProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(LifecycleProvider) as React.FC<LifecycleProviderProps>;
