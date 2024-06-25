import React from 'react';

import type { ComponentTupple } from '@/components/Compose/Compose.component';
import { Compose } from '@/components/Compose/Compose.component';
import type Engine from '@/pages/Canvas/engine';

import type { getManager } from '../managers';
import { ClipboardProvider } from './ClipboardContext';
import { ContextMenuProvider } from './ContextMenuContext';
import { EngineProvider } from './Engine.context';
import { FocusThreadProvider } from './FocusThreadContext';
import { LinkStepMenuProvider } from './LinkStepMenuContext';
import { ReduxContextsProviders } from './ReduxContexts';
import { SpotlightProvider } from './SpotlightContext';

export * from './ClipboardContext';
export * from './ContextMenuContext';
export * from './Engine.context';
export * from './EntityContexts';
export * from './FocusThreadContext';
export * from './LinkStepMenuContext';
export * from './PresentationModeContext';
export * from './ReduxContexts';
export * from './SpotlightContext';

export type ManagerGetter = typeof getManager;
export const ManagerContext = React.createContext<ManagerGetter | null>(null);
export const { Provider: ManagerProvider } = ManagerContext;

export interface CanvasProvidersProps extends React.PropsWithChildren {
  engine: Engine;
}

export const CanvasProviders: React.FC<CanvasProvidersProps> = ({ engine, children }) => (
  <Compose
    components={[
      [EngineProvider, { engine }] satisfies ComponentTupple<typeof EngineProvider>,
      ContextMenuProvider,
      ClipboardProvider,
      FocusThreadProvider,
      SpotlightProvider,
      LinkStepMenuProvider,
      ReduxContextsProviders,
    ]}
  >
    {children}
  </Compose>
);
