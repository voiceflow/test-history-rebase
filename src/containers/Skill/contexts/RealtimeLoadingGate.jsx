import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { realtimeLocksSelector, setupActiveDiagramConnection, terminateRealtimeConnection } from '@/ducks/realtime';
import { connect } from '@/hocs';

const RealtimeLoadingGate = ({ locks, setupConnection, terminateConnection, children }) => (
  <LoadingGate label="Collaboration" isLoaded={!!locks} load={setupConnection} unload={terminateConnection}>
    {children}
  </LoadingGate>
);

const mapStateToProps = {
  locks: realtimeLocksSelector,
};

const mapDispatchToProps = {
  setupConnection: setupActiveDiagramConnection,
  terminateConnection: terminateRealtimeConnection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RealtimeLoadingGate);
