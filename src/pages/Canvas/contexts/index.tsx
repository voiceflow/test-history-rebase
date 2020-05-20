import React from 'react';

import { BlockType, PlatformType } from '@/constants';
import { RegisterEngine } from '@/contexts';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { withContext } from '@/hocs/withContext';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { ConnectedStepProps } from '@/pages/Canvas/components/Step/types';

import { ClipboardProvider } from './ClipboardContext';
import { ContextMenuProvider } from './ContextMenuContext';
import { EngineProvider } from './EngineContext';
import { GroupSelectionProvider } from './GroupSelectionContext';
import { SpotlightProvider } from './SpotlightContext';

export * from './EngineContext';
export * from './ClipboardContext';
export * from './ContextMenuContext';
export * from './GroupSelectionContext';
export * from './SpotlightContext';
export * from './NodeIDContext';
export * from './PortIDContext';
export * from './LinkIDContext';
export * from './PresentationModeContext';

export type LinkLayerValue = {};

export const LinkLayerContext = React.createContext<LinkLayerValue | null>(null);
export const { Provider: LinkLayerProvider, Consumer: LinkLayerConsumer } = LinkLayerContext;

export const PlatformContext = React.createContext<PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;

export const withPlatform = withContext(PlatformContext, 'platform');

export type ManagerValue = {
  step: React.RefForwardingComponent<HTMLElement, ConnectedStepProps>;
  markupNode?: React.RefForwardingComponent<HTMLElement, ConnectedMarkupNodeProps>;
  mergeTerminator?: boolean;
};

export const ManagerContext = React.createContext<((type: BlockType) => ManagerValue) | null>(null);
export const { Provider: ManagerProvider, Consumer: ManagerConsumer } = ManagerContext;

export const CanvasProviders = connect({
  platform: activePlatformSelector,
})(({ engine, platform, children }) => (
  <PlatformProvider value={platform}>
    <EngineProvider value={engine}>
      <RegisterEngine engine={engine} />
      <ContextMenuProvider>
        <GroupSelectionProvider>
          <ClipboardProvider>
            <SpotlightProvider>{children}</SpotlightProvider>
          </ClipboardProvider>
        </GroupSelectionProvider>
      </ContextMenuProvider>
    </EngineProvider>
  </PlatformProvider>
));
