import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as Realtime from '@/ducks/realtime';
import { connect } from '@/hocs';

import { Warning } from './components';

const ProjectLockGate = ({ isSessionBusy, handleSessionTakeover, children }) => {
  const [errorScreen, setErrorScreen] = React.useState(null);

  const lockProject = () => {
    if (isSessionBusy) {
      setErrorScreen(
        <Warning
          onTakeover={() => {
            setErrorScreen();
            handleSessionTakeover();
            window.location.reload();
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectLockGate);
