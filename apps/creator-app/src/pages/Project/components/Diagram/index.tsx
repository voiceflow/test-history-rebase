import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import * as UI from '@/ducks/ui';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useDispatch, useEventualEngine, useSelector, useTeardown } from '@/hooks';
import Canvas from '@/pages/Canvas';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import { useManager } from '@/pages/Canvas/managers/utils';
import TestVariablesSidebar from '@/pages/Project/components/TestVariablesSidebar';
import { useAnyModeOpen, usePrototypingMode } from '@/pages/Project/hooks';
import PrototypeOverlay from '@/pages/Prototype/components/PrototypeOverlay';
import ReadOnlyBadge from '@/pages/Prototype/components/ReadOnlyBadge';

import DiagramSync from '../DiagramSync';
import MarkupImageLoading from '../MarkupImageLoading';
import { DiagramHotkeys } from './DiagramHotkeys.component';
import { DiagramLayout } from './DiagramLayout/DiagramLayout.component';
import { DiagramSidebar } from './DiagramSidebar/DiagramSidebar.component';
import DiagramGate from './gates/DiagramGate';

const Diagram: React.FC = () => {
  const canvasOnly = useSelector(UI.selectors.isCanvasOnly);

  const toggleCanvasOnly = useDispatch(UI.action.ToggleCanvasOnly);

  const engine = useEventualEngine();
  const getManager = useManager();
  const isDesignMode = !useAnyModeOpen();
  const isPrototypingMode = usePrototypingMode();

  const isCanvasEditable = !isPrototypingMode;

  useDidUpdateEffect(() => {
    if (!isDesignMode && canvasOnly) {
      toggleCanvasOnly();
    }
  }, [isDesignMode]);

  useTeardown(() => {
    engine()?.teardown();

    if (canvasOnly) {
      toggleCanvasOnly();
    }
  }, [canvasOnly]);

  return (
    <DiagramLayout>
      {isCanvasEditable && (
        <>
          <DiagramSync />
        </>
      )}

      <ManagerProvider value={getManager}>
        <ReadOnlyBadge />

        {/* always render the canvas, hide with CSS */}
        <Canvas isPrototypingMode={isPrototypingMode} />

        {!isPrototypingMode && <DiagramHotkeys />}

        {/* design mode */}

        {isPrototypingMode ? (
          <TestVariablesSidebar />
        ) : (
          <>
            <DiagramSidebar />
            <MarkupImageLoading />
          </>
        )}

        <PrototypeOverlay />
      </ManagerProvider>
    </DiagramLayout>
  );
};

export default withBatchLoadingGate(DiagramGate)(Diagram);
