import React from 'react';

import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import setupApp from '@/setup';

const LifecycleProvider = ({ history, browserID, tabID, children }) => {
  React.useEffect(() => {
    setupApp(history, browserID, tabID);
  }, []);

  return children;
};

const mapStateToProps = {
  browserID: Session.browserIDSelector,
  tabID: Session.tabIDSelector,
};

export default connect(mapStateToProps)(LifecycleProvider);
