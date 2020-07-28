import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FeatureFlag } from '@/config/features';
import { EventualEngineContext } from '@/contexts';
import { useFeature, useTeardown } from '@/hooks';
import Canvas from '@/pages/Canvas';
import CanvasControls from '@/pages/Canvas/components/CanvasControls';
import PrototypeSidebar from '@/pages/Canvas/components/PrototypeSidebar';
import TopPrompt from '@/pages/Canvas/components/TopPrompt';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import CanvasHeader from '@/pages/Canvas/header';
import { getManager } from '@/pages/Canvas/managers';
import { SettingsModalProvider } from '@/pages/Settings/contexts';
import DesignMenu from '@/pages/Skill/menus/DesignMenu';
import MarkupMenu from '@/pages/Skill/menus/MarkupMenu';

import { EditPermissionProvider, MarkupModeContext } from '../contexts';
import DiagramSync from './DiagramSync';
import FlowControls from './FlowControls';
import MarkupImageLoading from './MarkupImageLoading';

export type DiagramProps = RouteComponentProps & {
  diagramID: string;
  isPrototyping: boolean;
};

const Diagram: React.FC<DiagramProps> = ({ diagramID, isPrototyping }) => {
  const markupTool = React.useContext(MarkupModeContext);
  const eventualEngine = React.useContext(EventualEngineContext);
  const markupFeature = useFeature(FeatureFlag.MARKUP);

  useTeardown(() => {
    eventualEngine?.get()?.teardown();
  });

  return (
    <>
      {!isPrototyping && <DiagramSync diagramID={diagramID} />}
      <ManagerProvider value={getManager as any}>
        <EditPermissionProvider isPrototyping={isPrototyping}>
          <SettingsModalProvider>
            <CanvasHeader />

            <TopPrompt />

            {markupFeature.isEnabled && markupTool?.isOpen ? <MarkupMenu /> : <DesignMenu />}

            <CanvasControls />

            <FlowControls />

            <MarkupImageLoading />

            <Canvas />

            <PrototypeSidebar />
          </SettingsModalProvider>
        </EditPermissionProvider>
      </ManagerProvider>
    </>
  );
};

export default Diagram;
