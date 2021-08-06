import React from 'react';

import { BlockType } from '@/constants';
import { RegisterEngine } from '@/contexts';
import { Markup } from '@/models';
import type { Engine } from '@/pages/Canvas/engine';
import { NodeManagerConfig } from '@/pages/Canvas/managers/types';

import { ClipboardProvider } from './ClipboardContext';
import { ContextMenuProvider } from './ContextMenuContext';
import { EngineProvider } from './EngineContext';
import { FocusThreadProvider } from './FocusThreadContext';
import { ReduxContextsProviders } from './ReduxContexts';
import { SpotlightProvider } from './SpotlightContext';

export * from './ClipboardContext';
export * from './ContextMenuContext';
export * from './EngineContext';
export * from './EntityContexts';
export * from './FocusThreadContext';
export * from './PresentationModeContext';
export * from './ReduxContexts';
export * from './SpotlightContext';

export type ManagerGetter = <T extends object | Markup.AnyNodeData>(type: BlockType) => NodeManagerConfig<T>;
export const ManagerContext = React.createContext<ManagerGetter | null>(null);
export const { Provider: ManagerProvider, Consumer: ManagerConsumer } = ManagerContext;

export interface CanvasProvidersProps {
  engine: Engine;
}

export const CanvasProviders: React.FC<CanvasProvidersProps> = ({ engine, children }) => (
  <EngineProvider value={engine}>
    <RegisterEngine engine={engine} />
    <ContextMenuProvider>
      <ClipboardProvider>
        <FocusThreadProvider>
          <SpotlightProvider>
            <ReduxContextsProviders>{children}</ReduxContextsProviders>
          </SpotlightProvider>
        </FocusThreadProvider>
      </ClipboardProvider>
    </ContextMenuProvider>
  </EngineProvider>
);
