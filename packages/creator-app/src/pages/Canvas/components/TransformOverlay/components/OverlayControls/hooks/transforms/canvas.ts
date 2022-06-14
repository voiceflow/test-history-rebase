import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasPanApplied, useCanvasZoomApplied } from '@/pages/Canvas/hooks';

const useCanvasInteractions = (resizeOverlay: (rect: DOMRect) => void) => {
  const engine = React.useContext(EngineContext)!;

  const onCanvasInteraction = usePersistFunction(() => {
    if (!engine.transformation.isActive || !engine.focus.hasTarget) return;

    const transform = engine.node.api(engine.focus.getTarget()!)?.instance?.getTransform?.();

    if (!transform) return;

    resizeOverlay(transform.rect);
  });

  useCanvasPanApplied(onCanvasInteraction);
  useCanvasZoomApplied(onCanvasInteraction);
};

export default useCanvasInteractions;
