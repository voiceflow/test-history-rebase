import React from 'react';

import { BlockType, PlatformType } from '@/constants';
import { RegisterEngine } from '@/contexts';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { withContext } from '@/hocs/withContext';
import { Markup } from '@/models';
import type { Engine } from '@/pages/Canvas/engine';
import { NodeManagerConfig } from '@/pages/Canvas/managers/types';

import { ClipboardProvider } from './ClipboardContext';
import { ContextMenuProvider } from './ContextMenuContext';
import { EngineProvider } from './EngineContext';
import { FocusThreadProvider } from './FocusThreadContext';
import { SpotlightProvider } from './SpotlightContext';

export * from './ClipboardContext';
export * from './ContextMenuContext';
export * from './EngineContext';
export * from './EntityContexts';
export * from './FocusThreadContext';
export * from './PresentationModeContext';
export * from './SpotlightContext';

export const PlatformContext = React.createContext<PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;

export const withPlatform = withContext(PlatformContext, 'platform');

export type ManagerGetter = <T extends object | Markup.AnyNodeData>(type: BlockType) => NodeManagerConfig<T>;
export const ManagerContext = React.createContext<ManagerGetter | null>(null);
export const { Provider: ManagerProvider, Consumer: ManagerConsumer } = ManagerContext;

export const withManager = withContext(ManagerContext, 'getManager');

export type CanvasProvidersProps = {
  engine: Engine;
};

export const CanvasProviders = connect({
  platform: activePlatformSelector,
})<CanvasProvidersProps>(({ engine, platform, children }) => (
  <PlatformProvider value={platform}>
    <EngineProvider value={engine}>
      <RegisterEngine engine={engine} />
      <ContextMenuProvider>
        <ClipboardProvider>
          <FocusThreadProvider>
            <SpotlightProvider>{children}</SpotlightProvider>
          </FocusThreadProvider>
        </ClipboardProvider>
      </ContextMenuProvider>
    </EngineProvider>
  </PlatformProvider>
)) as React.FC<CanvasProvidersProps>;
