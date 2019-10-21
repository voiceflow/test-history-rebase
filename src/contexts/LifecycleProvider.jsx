import React from 'react';

import { tabIDSelector } from '@/ducks/session';
import { connect } from '@/hocs';
import setupApp from '@/setup';

const LifecycleProvider = ({ history, tabID, children }) => {
  React.useEffect(() => {
    setupApp(history, tabID);
  }, []);

  return children;
};

const mapStateToProps = {
  tabID: tabIDSelector,
};

export default connect(mapStateToProps)(LifecycleProvider);
