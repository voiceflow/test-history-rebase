import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Feature from '@/ducks/feature';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const WorkspaceFeatureLoadingGate: React.FC<ConnectedWorkspaceFeatureLoadingGateProps> = ({ isLoaded, loadFeatures, children }) => (
  <LoadingGate label="Workspace Features" isLoaded={isLoaded} load={loadFeatures}>
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  isLoaded: Feature.isWorkspaceLoadedSelector,
};

const mapDispatchToProps = {
  loadFeatures: Feature.loadWorkspaceFeatures,
};

type ConnectedWorkspaceFeatureLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceFeatureLoadingGate);
