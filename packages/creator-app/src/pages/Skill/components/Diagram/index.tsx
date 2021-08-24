import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import * as Transcripts from '@/ducks/transcript';
import * as UI from '@/ducks/ui';
import { useDispatch, useEventualEngine, useRouteDiagramID, useSelector, useTeardown } from '@/hooks';
import Canvas from '@/pages/Canvas';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import { getManager } from '@/pages/Canvas/managers';
import PrototypeOverlay from '@/pages/Prototype/components/PrototypeOverlay';
import ReadOnlyBadge from '@/pages/Prototype/components/ReadOnlyBadge';
import DesignMenu from '@/pages/Skill/components/DesignMenu';
import { useAnyModeOpen, usePrototypingMode } from '@/pages/Skill/hooks';

import DiagramSync from '../DiagramSync';
import MarkupImageLoading from '../MarkupImageLoading';
import { HotKeys } from './components';

export type DiagramProps = RouteComponentProps;

const Diagram: React.FC<DiagramProps> = () => {
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const toggleCanvasOnly = useDispatch(UI.toggleCanvasOnly);
  const checkUnreadTranscripts = useDispatch(Transcripts.updateHasUnreadTranscripts);

  const engine = useEventualEngine();
  const isDesignMode = !useAnyModeOpen();
  const routeDiagramID = useRouteDiagramID();
  const isPrototypingMode = usePrototypingMode();

  const isCanvasEditable = !isPrototypingMode;

  useDidUpdateEffect(() => {
    if (!isDesignMode && canvasOnly) {
      toggleCanvasOnly();
    }
  }, [isDesignMode]);

  React.useEffect(() => {
    checkUnreadTranscripts();
  }, []);

  useTeardown(() => {
    engine()?.teardown();

    if (canvasOnly) {
      toggleCanvasOnly();
    }
  }, [canvasOnly]);

  return (
    <>
      {isCanvasEditable && <DiagramSync diagramID={routeDiagramID} />}

      <ManagerProvider value={getManager as any}>
        <ReadOnlyBadge />

        {/* always render the canvas, hide with CSS */}
        <Canvas isPrototypingMode={isPrototypingMode} />

        {!isPrototypingMode && <HotKeys />}

        {/* design mode */}
        {isDesignMode && (
          <>
            <DesignMenu />
            <MarkupImageLoading />
          </>
        )}

        <PrototypeOverlay />
      </ManagerProvider>
    </>
  );
};

export default Diagram;
