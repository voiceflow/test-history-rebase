import React from 'react';

import { DisplayModalProvider } from '@/containers/CanvasV2/contexts/DisplayModalContext';
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

export * from './TestingModeContext';
export * from './EngineContext';
export * from './ClipboardContext';
export * from './ContextMenuContext';
export * from './LinkCreationContext';
export * from './GroupSelectionContext';
export * from './SpotlightContext';
export * from './ShortcutModalContext';
export * from './HelpModalContext';
export * from './SettingsModalContext';
export * from './NodeIDContext';
export * from './PortIDContext';
export * from './LinkIDContext';

export const LinkLayerContext = React.createContext(null);
export const { Provider: LinkLayerProvider, Consumer: LinkLayerConsumer } = LinkLayerContext;

export const PlatformContext = React.createContext(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;

export const withPlatform = withContext(PlatformContext, 'platform');

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
                <DisplayModalProvider>
                  <HelpModalProvider>{children}</HelpModalProvider>
                </DisplayModalProvider>
              </SpotlightProvider>
            </ClipboardProvider>
          </LinkCreationProvider>
        </GroupSelectionProvider>
      </ContextMenuProvider>
    </EngineProvider>
  </PlatformProvider>
));
