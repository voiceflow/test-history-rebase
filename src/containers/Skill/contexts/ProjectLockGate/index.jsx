import React from 'react';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import { useEnableDisable } from '@/hooks';

import { ConnectionError, Warning } from './components';

const ProjectLockGate = ({ skillID, children }) => {
  const [hasLock, acceptLock] = useEnableDisable();
  const [errorScreen, setErrorScreen] = React.useState(null);

  const lockProject = () => {
    if (client.socket.isHealthy) {
      client.socket.lockProject(skillID, acceptLock, (target) =>
        setErrorScreen(
          <Warning
            target={target}
            onTakeover={() => {
              client.socket.takeoverProject(skillID);
              window.location.reload();
            }}
          />
        )
      );
    } else {
      setErrorScreen(<ConnectionError />);
    }
  };
  const releaseLock = () => client.socket.releaseProject(skillID);

  if (errorScreen) {
    return <div className="super-center w-100 h-100">{errorScreen}</div>;
  }

  return (
    <LoadingGate label="Session" isLoaded={hasLock} load={lockProject} unload={releaseLock}>
      {children}
    </LoadingGate>
  );
};

export default ProjectLockGate;
