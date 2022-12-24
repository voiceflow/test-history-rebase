import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Feature from '@/ducks/feature';
import { connect } from '@/hocs/connect';
import { ConnectedProps } from '@/types';

const FeatureLoadingGate: React.FC<ConnectedFeatureLoadingGateProps> = ({ isLoaded, loadFeatures, children }) => (
  <LoadingGate label="Features" internalName={FeatureLoadingGate.name} isLoaded={isLoaded} load={loadFeatures}>
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  isLoaded: Feature.isLoadedSelector,
};

const mapDispatchToProps = {
  loadFeatures: Feature.loadFeatures,
};

type ConnectedFeatureLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(FeatureLoadingGate);
