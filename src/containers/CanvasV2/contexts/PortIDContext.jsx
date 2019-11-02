import React from 'react';

import { withHook } from '@/hocs';

import { EngineContext } from './EngineContext';

export const PortIDContext = React.createContext(null);
export const { Provider: PortIDProvider, Consumer: PortIDConsumer } = PortIDContext;

export const usePort = () => {
  const portID = React.useContext(PortIDContext);
  const engine = React.useContext(EngineContext);

  return engine.dispatcher.usePort(portID);
};

export const withPort = withHook(usePort, {
  shouldRender: ({ port }) => port,
});
