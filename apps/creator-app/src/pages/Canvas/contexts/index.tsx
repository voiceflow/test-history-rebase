import React from 'react';

import { RegisterEngine } from '@/contexts/EventualEngineContext';
import type Engine from '@/pages/Canvas/engine';

import { getManager } from '../managers';
import { ClipboardProvider } from './ClipboardContext';
import { ContextMenuProvider } from './ContextMenuContext';
import { EngineProvider } from './EngineContext';
import { FocusThreadProvider } from './FocusThreadContext';
import { LinkStepMenuProvider } from './LinkStepMenuContext';
import { ReduxContextsProviders } from './ReduxContexts';
import { SpotlightProvider } from './SpotlightContext';

export * from './ClipboardContext';
export * from './ContextMenuContext';
export * from './EngineContext';
export * from './EntityContexts';
export * from './FocusThreadContext';
export * from './LinkStepMenuContext';
export * from './PresentationModeContext';
export * from './ReduxContexts';
export * from './SpotlightContext';

export type ManagerGetter = typeof getManager;
export const ManagerContext = React.createContext<ManagerGetter | null>(null);
export const { Provider: ManagerProvider, Consumer: ManagerConsumer } = ManagerContext;

export interface CanvasProvidersProps extends React.PropsWithChildren {
  engine: Engine;
}

export const CanvasProviders: React.FC<CanvasProvidersProps> = ({ engine, children }) => (
  <EngineProvider value={engine}>
    <RegisterEngine engine={engine} />

    <ContextMenuProvider>
      <ClipboardProvider>
        <FocusThreadProvider>
          <SpotlightProvider>
            <LinkStepMenuProvider>
              <ReduxContextsProviders>{children}</ReduxContextsProviders>
            </LinkStepMenuProvider>
          </SpotlightProvider>
        </FocusThreadProvider>
      </ClipboardProvider>
    </ContextMenuProvider>
  </EngineProvider>
);
