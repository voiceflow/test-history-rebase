import React from 'react';

import { EngineContext, PlatformContext } from '@/containers/CanvasV2/contexts';

// eslint-disable-next-line import/prefer-default-export
export function usePortFilter() {
  const engine = React.useContext(EngineContext);
  const platform = React.useContext(PlatformContext);

  return (portID) => {
    const port = engine.getPortByID(portID);

    return port && (!port.platform || port.platform === platform);
  };
}
