import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const WorkspaceFeatureLoadingGate: React.FC<ConnectedWorkspaceFeatureLoadingGateProps> = ({
  hasActiveWorkspace,
  isLoaded,
  loadFeatures,
  children,
}) => (
  <LoadingGate label="Workspace Features" isLoaded={!hasActiveWorkspace || isLoaded} load={loadFeatures}>
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  isLoaded: Feature.isWorkspaceLoadedSelector,
  hasActiveWorkspace: Session.hasActiveWorkspaceSelector,
};

const mapDispatchToProps = {
  loadFeatures: Feature.loadWorkspaceFeatures,
};

type ConnectedWorkspaceFeatureLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceFeatureLoadingGate);
