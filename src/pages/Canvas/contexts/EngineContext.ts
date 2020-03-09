import React from 'react';

import { withContext } from '@/hocs';

export type Engine = {
  getLinkIDsByPortID: (portID: string) => string[];
  registerPort: (portID: string, api: { getRect: () => DOMRect }) => void;
  expirePort: (portID: string, api: { getRect: () => DOMRect }) => void;
  isNodeMovementLocked: (nodeID: string) => boolean;

  link: {
    remove: (linkID: string) => Promise<void>;
    add: (sourcePortID: string, targetPortID: string) => Promise<void>;
  };

  dispatcher: {
    usePort: (portID: string) => { portID: string; port: unknown; hasActiveLinks: boolean };
  };
};

export const EngineContext = React.createContext<Engine | null>(null);
export const { Provider: EngineProvider, Consumer: EngineConsumer } = EngineContext;

export const withEngine = withContext(EngineContext, 'engine');
