import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasPanApplied, useCanvasZoomApplied } from '@/pages/Canvas/hooks/canvas';
import { MarkupTransform } from '@/pages/Canvas/types';

const useCanvasInteractions = (syncOverlay: (transform: MarkupTransform) => void) => {
  const engine = React.useContext(EngineContext)!;

  const onCanvasInteraction = usePersistFunction(() => {
    if (!engine.transformation.isActive || !engine.focus.hasTarget) return;

    const transform = engine.node.api(engine.focus.getTarget()!)?.instance?.getTransform?.();

    if (!transform) return;

    syncOverlay(transform);
  });

  useCanvasPanApplied(onCanvasInteraction);
  useCanvasZoomApplied(onCanvasInteraction);
};

export default useCanvasInteractions;
