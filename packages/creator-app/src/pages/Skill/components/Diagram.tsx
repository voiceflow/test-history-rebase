import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useEventualEngine, useRouteDiagramID, useTeardown } from '@/hooks';
import Canvas from '@/pages/Canvas';
import CanvasControls from '@/pages/Canvas/components/CanvasControls';
import TopPrompt from '@/pages/Canvas/components/TopPrompt';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import { getManager } from '@/pages/Canvas/managers';
import PrototypeOverlay from '@/pages/Prototype/components/PrototypeOverlay';
import ReadOnlyBadge from '@/pages/Prototype/components/ReadOnlyBadge';
import DesignMenu from '@/pages/Skill/components/DesignMenu';
import { useAnyModeOpen, usePrototypingMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';

import DiagramSync from './DiagramSync';
import FlowControls from './FlowControls';
import MarkupImageLoading from './MarkupImageLoading';

export type DiagramProps = RouteComponentProps & {
  diagramID: string;
};

const Diagram: React.FC<DiagramProps & ConnectedDiagramProps> = ({ canvasOnly }) => {
  const engine = useEventualEngine();
  const isDesignMode = !useAnyModeOpen();
  const isPrototypingMode = usePrototypingMode();
  const routeDiagramID = useRouteDiagramID();

  const isCanvasEditable = !isPrototypingMode;

  useTeardown(() => {
    engine()?.teardown();
  });

  return (
    <>
      {isCanvasEditable && <DiagramSync diagramID={routeDiagramID} />}

      <ManagerProvider value={getManager as any}>
        {!isDesignMode && <TopPrompt />}

        <ReadOnlyBadge />

        {/* always render the canvas, hide with CSS */}
        <Canvas isPrototypingMode={isPrototypingMode} />

        {!isPrototypingMode && <CanvasControls render={!canvasOnly} />}

        {/* design mode */}
        {isDesignMode && (
          <>
            <DesignMenu />
            <FlowControls render={!canvasOnly} />
            <MarkupImageLoading />
          </>
        )}

        <PrototypeOverlay />

        {canvasOnly && <RemoveIntercom />}
      </ManagerProvider>
    </>
  );
};

const mapStateToProps = {
  canvasOnly: UI.isCanvasOnlyShowingSelector,
};

type ConnectedDiagramProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Diagram) as React.FC<DiagramProps>;
