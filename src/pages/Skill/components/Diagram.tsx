import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import { FeatureFlag } from '@/config/features';
import { EventualEngineContext } from '@/contexts';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
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
import { ConnectedProps } from '@/types';

import DiagramSync from './DiagramSync';
import FlowControls from './FlowControls';
import MarkupImageLoading from './MarkupImageLoading';

export type DiagramProps = RouteComponentProps & {
  diagramID: string;
};

const Diagram: React.FC<DiagramProps & ConnectedDiagramProps> = ({ diagramID, canvasOnly }) => {
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

        <CanvasControls render={(!prototypeTest.isEnabled || !isPrototypingMode) && !canvasOnly} />

        <FlowControls render={!canvasOnly} />

        <MarkupImageLoading />

        <PrototypePage />

        <PrototypeSidebar />

        {canvasOnly && <RemoveIntercom />}
      </ManagerProvider>
    </>
  );
};

const mapStateToProps = {
  canvasOnly: UI.isCanvasOnlyShowingSelector,
};

const mapDispatchToProps = {};

type ConnectedDiagramProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Diagram) as React.FC<DiagramProps>;
