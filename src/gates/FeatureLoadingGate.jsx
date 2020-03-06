import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';

const FeatureLoadingGate = ({ isLoaded, authToken, loadFeatures, children }) => (
  <LoadingGate label="Features" isLoaded={!authToken || isLoaded} load={loadFeatures}>
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  isLoaded: Feature.isLoadedSelector,
  authToken: Session.authTokenSelector,
};

const mapDispatchToProps = {
  loadFeatures: Feature.loadFeatures,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeatureLoadingGate);
