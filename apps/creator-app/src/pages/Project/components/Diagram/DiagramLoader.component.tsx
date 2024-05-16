import React from 'react';
import { useParams } from 'react-router-dom';

import Canvas from '@/components/Canvas';
import { UI, Viewport } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { CanvasBlurLoader } from '@/pages/Canvas/components/CanvasBlurLoader/CanvasBlurLoader.component';
import { DiagramSidebar } from '@/pages/Project/components/Diagram/DiagramSidebar/DiagramSidebar.component';
import { useInteractiveMode } from '@/pages/Project/hooks';

export const DiagramLoader: React.FC = () => {
  const params = useParams<{ diagramID?: string }>();
  const isDesignMode = !useInteractiveMode();

  const viewport = useSelector(Viewport.viewportByDiagramIDSelector, { diagramID: params.diagramID });
  const zoomType = useSelector(UI.selectors.zoomType);
  const canvasGridEnabled = useSelector(UI.selectors.isCanvasGrid);

  return (
    <>
      <Canvas viewport={viewport ?? { x: 0, y: 0, zoom: 75 }} getZoomType={() => zoomType} canvasGridEnabled={canvasGridEnabled} />
      <CanvasBlurLoader shown />

      {isDesignMode && <DiagramSidebar />}
    </>
  );
};
