import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FeatureFlag } from '@/config/features';
import { EventualEngineContext } from '@/contexts';
import { useFeature, useTeardown } from '@/hooks';
import Canvas from '@/pages/Canvas';
import CanvasControls from '@/pages/Canvas/components/CanvasControls';
import { CanvasReadOnly } from '@/pages/Canvas/components/CanvasControls/components';
import PrototypeSidebar from '@/pages/Canvas/components/PrototypeSidebar';
import TopPrompt from '@/pages/Canvas/components/TopPrompt';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import CanvasHeader from '@/pages/Canvas/header';
import { getManager } from '@/pages/Canvas/managers';
import { SettingsModalProvider } from '@/pages/Settings/contexts';
import DesignMenu from '@/pages/Skill/menus/DesignMenu';
import MarkupMenu from '@/pages/Skill/menus/MarkupMenu';

import { CommentModeContext, EditPermissionProvider, MarkupModeContext } from '../contexts';
import DiagramSync from './DiagramSync';
import FlowControls from './FlowControls';
import MarkupImageLoading from './MarkupImageLoading';

export type DiagramProps = RouteComponentProps & {
  diagramID: string;
  isPrototyping: boolean;
};

const Diagram: React.FC<DiagramProps> = ({ diagramID, isPrototyping, location }) => {
  const markupTool = React.useContext(MarkupModeContext);
  const commenting = React.useContext(CommentModeContext);
  const eventualEngine = React.useContext(EventualEngineContext);
  const markupFeature = useFeature(FeatureFlag.MARKUP);
  const commentingFeature = useFeature(FeatureFlag.COMMENTING);

  React.useEffect(() => {
    if (commentingFeature.isEnabled) {
      const isCommenting = location.pathname.includes('/commenting');

      if (isCommenting && !commenting.isOpen) {
        commenting.open();
      } else if (!isCommenting && commenting.isOpen) {
        commenting.close();
      }
    }
  }, [location.pathname]);

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

            <CanvasReadOnly />

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
