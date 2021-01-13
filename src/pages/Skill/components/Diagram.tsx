import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { RemoveIntercom } from '@/components/IntercomChat';
import * as Prototype from '@/ducks/prototype';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useEventualEngine, useTeardown } from '@/hooks';
import Canvas from '@/pages/Canvas';
import CanvasControls from '@/pages/Canvas/components/CanvasControls';
import TopPrompt from '@/pages/Canvas/components/TopPrompt';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import { getManager } from '@/pages/Canvas/managers';
import PrototypeDeveloperSettings from '@/pages/Prototype/components/PrototypeDeveloperSettings';
import PrototypeDisplaySettings from '@/pages/Prototype/components/PrototypeDisplaySettings';
import PrototypeSidebar from '@/pages/Prototype/components/PrototypeSidebar';
import PrototypeVisualCanvas from '@/pages/Prototype/components/PrototypeVisualCanvas';
import ReadOnlyBadge from '@/pages/Prototype/components/ReadOnlyBadge';
import { useAnyModeOpen, useMarkupMode, usePrototypingMode } from '@/pages/Skill/hooks';
import DesignMenu from '@/pages/Skill/menus/DesignMenu';
import MarkupMenu from '@/pages/Skill/menus/MarkupMenu';
import PrototypeMenu from '@/pages/Skill/menus/PrototypeMenu';
import { ConnectedProps } from '@/types';

import DiagramSync from './DiagramSync';
import FlowControls from './FlowControls';
import MarkupImageLoading from './MarkupImageLoading';

export type DiagramProps = RouteComponentProps & {
  diagramID: string;
};

const Diagram: React.FC<DiagramProps & ConnectedDiagramProps> = ({ diagramID, prototypeMode, canvasOnly }) => {
  const engine = useEventualEngine();
  const isPrototypingMode = usePrototypingMode();
  const isMarkupMode = useMarkupMode();
  const isDesignMode = !useAnyModeOpen();

  const isCanvasVisible = !isPrototypingMode || prototypeMode !== Prototype.PrototypeMode.DISPLAY;
  const isCanvasEditable = !isPrototypingMode;

  React.useEffect(() => {
    if (isCanvasVisible) return undefined;

    engine()?.hideCanvas();
    return () => engine()?.showCanvas();
  }, [isCanvasVisible]);

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
        <Canvas />

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

        {/* prototyping mode */}
        <PrototypeSidebar open={isPrototypingMode} />
        <PrototypeMenu open={isPrototypingMode} />
        {isPrototypingMode && (
          <>
            <PrototypeDeveloperSettings open={prototypeMode === Prototype.PrototypeMode.DEVELOPER} />

            {prototypeMode === Prototype.PrototypeMode.DISPLAY && <PrototypeVisualCanvas />}
            <PrototypeDisplaySettings open={prototypeMode === Prototype.PrototypeMode.DISPLAY} />
          </>
        )}

        {canvasOnly && <RemoveIntercom />}
      </ManagerProvider>
    </>
  );
};

const mapStateToProps = {
  canvasOnly: UI.isCanvasOnlyShowingSelector,
  prototypeMode: Prototype.prototypeModeSelector,
};

type ConnectedDiagramProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Diagram) as React.FC<DiagramProps>;
