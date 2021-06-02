import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';
import { PlatformContext } from '@/pages/Skill/contexts';

// eslint-disable-next-line import/prefer-default-export
export function usePortFilter() {
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext);

  return (portID: string) => {
    const port = engine.getPortByID(portID);

    return port && (!port.platform || port.platform === platform);
  };
}
