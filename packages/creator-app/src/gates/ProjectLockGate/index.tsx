import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Realtime from '@/ducks/realtime';
import { withoutFeatureGate } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';

import { Warning } from './components';

const ProjectLockGate: React.FC = ({ children }) => {
  const isSessionBusy = useSelector(Realtime.isSessionBusy);
  const handleSessionTakeover = useDispatch(Realtime.handleRealtimeTakeover);
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

export default withoutFeatureGate(FeatureFlag.ATOMIC_ACTIONS_PHASE_2)(ProjectLockGate);
