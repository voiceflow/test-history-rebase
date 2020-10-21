import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { FeatureFlag } from '@/config/features';
import { EventualEngineContext } from '@/contexts';
import { useFeature, useTeardown } from '@/hooks';
import CanvasControls from '@/pages/Canvas/components/CanvasControls';
import PrototypeSidebar from '@/pages/Canvas/components/PrototypeSidebar';
import TopPrompt from '@/pages/Canvas/components/TopPrompt';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import { getManager } from '@/pages/Canvas/managers';
import PrototypePage from '@/pages/Prototype/components/PrototypePage';
import { useMarkupMode, usePrototypingMode } from '@/pages/Skill/hooks';
import DesignMenu from '@/pages/Skill/menus/DesignMenu';
import MarkupMenu from '@/pages/Skill/menus/MarkupMenu';

import DiagramSync from './DiagramSync';
import FlowControls from './FlowControls';
import MarkupImageLoading from './MarkupImageLoading';

export type DiagramProps = RouteComponentProps & {
  diagramID: string;
};

const Diagram: React.FC<DiagramProps> = ({ diagramID }) => {
  const prototypeTest = useFeature(FeatureFlag.PROTOTYPE_TEST);

  const eventualEngine = React.useContext(EventualEngineContext);
  const isPrototypingMode = usePrototypingMode();
  const isMarkupMode = useMarkupMode();

  useTeardown(() => {
    eventualEngine?.get()?.teardown();
  });

  return (
    <>
      {!isPrototypingMode && <DiagramSync diagramID={diagramID} />}
      <ManagerProvider value={getManager as any}>
        <TopPrompt />

        {isMarkupMode ? <MarkupMenu /> : <DesignMenu />}

        {(!prototypeTest.isEnabled || !isPrototypingMode) && <CanvasControls />}

        <FlowControls />

        <MarkupImageLoading />

        <PrototypePage />

        <PrototypeSidebar />
      </ManagerProvider>
    </>
  );
};

export default Diagram;
