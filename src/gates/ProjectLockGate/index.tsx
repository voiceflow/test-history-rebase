import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { Warning } from './components';

const ProjectLockGate: React.FC<ConnectedProjectLockGateProps> = ({ isSessionBusy, handleSessionTakeover, children }) => {
  const [errorScreen, setErrorScreen] = React.useState<JSX.Element | null>(null);

  const lockProject = () => {
    if (isSessionBusy) {
      setErrorScreen(
        <Warning
          onTakeover={() => {
            setErrorScreen(null);
            handleSessionTakeover();
            setTimeout(window.location.reload, 150);
          }}
        />
      );
    }
  };

  if (errorScreen) {
    return <div className="super-center w-100 h-100">{errorScreen}</div>;
  }

  return (
    <LoadingGate label="Session" isLoaded={!isSessionBusy} load={lockProject}>
      {children}
    </LoadingGate>
  );
};

const mapStateToProps = {
  isSessionBusy: Realtime.isSessionBusy,
};

const mapDispatchToProps = {
  handleSessionTakeover: Realtime.handleRealtimeTakeover,
};

type ConnectedProjectLockGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectLockGate);
