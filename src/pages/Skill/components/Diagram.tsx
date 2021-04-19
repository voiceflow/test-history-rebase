import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useEventualEngine, useTeardown } from '@/hooks';
import Canvas from '@/pages/Canvas';
import CanvasControls from '@/pages/Canvas/components/CanvasControls';
import TopPrompt from '@/pages/Canvas/components/TopPrompt';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import { getManager } from '@/pages/Canvas/managers';
import PrototypeOverlay from '@/pages/Prototype/components/PrototypeOverlay';
import ReadOnlyBadge from '@/pages/Prototype/components/ReadOnlyBadge';
import { useAnyModeOpen, useMarkupMode, usePrototypingMode } from '@/pages/Skill/hooks';
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
  const engine = useEventualEngine();
  const isMarkupMode = useMarkupMode();
  const isDesignMode = !useAnyModeOpen();
  const isPrototypingMode = usePrototypingMode();

  const isCanvasEditable = !isPrototypingMode;

  useTeardown(() => {
    engine()?.teardown();
  });

  return (
    <>
      {isCanvasEditable && <DiagramSync diagramID={diagramID} />}

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
          </>
        )}

        {/* markup mode */}
        {isMarkupMode && (
          <>
            <MarkupMenu />
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
