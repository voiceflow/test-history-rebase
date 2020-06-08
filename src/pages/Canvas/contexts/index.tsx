import React from 'react';

import { BlockType, PlatformType } from '@/constants';
import { RegisterEngine } from '@/contexts';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { withContext } from '@/hocs/withContext';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { ConnectedStepProps } from '@/pages/Canvas/components/Step/types';
import type { Engine } from '@/pages/Canvas/engine';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

import { ClipboardProvider } from './ClipboardContext';
import { ContextMenuProvider } from './ContextMenuContext';
import { EngineProvider } from './EngineContext';
import { GroupSelectionProvider } from './GroupSelectionContext';
import { SpotlightProvider } from './SpotlightContext';

export * from './EngineContext';
export * from './EntityContexts';
export * from './ClipboardContext';
export * from './ContextMenuContext';
export * from './GroupSelectionContext';
export * from './SpotlightContext';
export * from './PresentationModeContext';

export const PlatformContext = React.createContext<PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;

export const withPlatform = withContext(PlatformContext, 'platform');

export type ManagerValue = {
  nodeID: string;
  step: React.RefForwardingComponent<HTMLElement, ConnectedStepProps>;
  label?: string;
  markupNode?: React.FC<ConnectedMarkupNodeProps & { ref: React.Ref<HTMLElement> }>;
  mergeInitializer?: boolean;
  mergeTerminator?: boolean;
  editorsByPath: Record<string, NodeEditorPropsType<any>>;
  editor: NodeEditorPropsType<any>;
};

export type ManagerGetter = (type: BlockType) => ManagerValue;
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
        <GroupSelectionProvider>
          <ClipboardProvider>
            <SpotlightProvider>{children}</SpotlightProvider>
          </ClipboardProvider>
        </GroupSelectionProvider>
      </ContextMenuProvider>
    </EngineProvider>
  </PlatformProvider>
)) as React.FC<CanvasProvidersProps>;
