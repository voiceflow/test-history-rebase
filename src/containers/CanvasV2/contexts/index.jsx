import React from 'react';

import { RegisterEngine } from '@/contexts/EventualEngineContext';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { withContext } from '@/hocs/withContext';

import { ClipboardProvider } from './ClipboardContext';
import { ContextMenuProvider } from './ContextMenuContext';
import { EngineProvider } from './EngineContext';
import { GroupSelectionProvider } from './GroupSelectionContext';
import { HelpModalProvider } from './HelpModalContext';
import { LinkCreationProvider } from './LinkCreationContext';
import { SpotlightProvider } from './SpotlightContext';

export * from './EditPermissionContext';
export * from './EngineContext';
export * from './ClipboardContext';
export * from './ContextMenuContext';
export * from './LinkCreationContext';
export * from './GroupSelectionContext';
export * from './SpotlightContext';
export * from './ShortcutModalContext';
export * from './HelpModalContext';
export * from './NodeIDContext';
export * from './PortIDContext';
export * from './LinkIDContext';

export const LinkLayerContext = React.createContext(null);
export const { Provider: LinkLayerProvider, Consumer: LinkLayerConsumer } = LinkLayerContext;

export const PlatformContext = React.createContext(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;

export const withPlatform = withContext(PlatformContext, 'platform');

export const ManagerContext = React.createContext(null);
export const { Provider: ManagerProvider, Consumer: ManagerConsumer } = ManagerContext;

export const withManager = withContext(ManagerContext, 'getManager');

export const CanvasProviders = connect({
  platform: activePlatformSelector,
})(({ engine, platform, children }) => (
  <PlatformProvider value={platform}>
    <EngineProvider value={engine}>
      <RegisterEngine engine={engine} />
      <ContextMenuProvider>
        <GroupSelectionProvider>
          <LinkCreationProvider>
            <ClipboardProvider>
              <SpotlightProvider>
                <HelpModalProvider>{children}</HelpModalProvider>
              </SpotlightProvider>
            </ClipboardProvider>
          </LinkCreationProvider>
        </GroupSelectionProvider>
      </ContextMenuProvider>
    </EngineProvider>
  </PlatformProvider>
));
