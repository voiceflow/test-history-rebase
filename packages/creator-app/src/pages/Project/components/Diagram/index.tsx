import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import * as Transcripts from '@/ducks/transcript';
import * as UI from '@/ducks/ui';
import { RealtimeLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useDispatch, useEventualEngine, useSelector, useTeardown } from '@/hooks';
import Canvas from '@/pages/Canvas';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import { getManager } from '@/pages/Canvas/managers';
import DesignMenu from '@/pages/Project/components/DesignMenu';
import { useAnyModeOpen, usePrototypingMode } from '@/pages/Project/hooks';
import PrototypeOverlay from '@/pages/Prototype/components/PrototypeOverlay';
import ReadOnlyBadge from '@/pages/Prototype/components/ReadOnlyBadge';

import DiagramSync from '../DiagramSync';
import MarkupImageLoading from '../MarkupImageLoading';
import { HotKeys } from './components';
import DiagramGate from './gates/DiagramGate';

export type DiagramProps = RouteComponentProps;

const Diagram: React.FC<DiagramProps> = () => {
  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const toggleCanvasOnly = useDispatch(UI.toggleCanvasOnly);
  const checkUnreadTranscripts = useDispatch(Transcripts.updateHasUnreadTranscripts);

  const engine = useEventualEngine();
  const isDesignMode = !useAnyModeOpen();
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
      {isCanvasEditable && <DiagramSync />}

      <ManagerProvider value={getManager}>
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

export default withBatchLoadingGate(DiagramGate, RealtimeLoadingGate)(Diagram);
