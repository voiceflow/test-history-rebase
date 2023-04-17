import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useRAF, useTheme } from '@/hooks';
import type Engine from '@/pages/Canvas/engine';

const FOCUSED_NODE_SIDEBAR_OFFSET = 20;

export const useUseAutopanBlockIntoView = ({ engine, blockID, isOpened }: { engine: Engine; blockID: Nullable<string>; isOpened: boolean }): void => {
  const theme = useTheme();
  const [canvasPositionScheduler] = useRAF();

  React.useEffect(() => {
    const block = engine.getNodeByID(blockID);
    const { canvas } = engine;

    if (!isOpened || !block || !canvas || Realtime.Utils.typeGuards.isMarkupBlockType(block.type)) return;

    const offset = FOCUSED_NODE_SIDEBAR_OFFSET / canvas.getZoom();
    const canvasPosition = canvas.getPosition();
    const canvasRect = canvas.getRect();
    const canvasEndX = canvasRect.width - theme.components.blockSidebar.width;
    const [blockEndX] = canvas
      .toCoords([block.x, block.y])
      .add([offset + theme.components.block.width / 2, 0])
      .raw();

    if (blockEndX > canvasEndX) {
      canvasPositionScheduler(() => {
        canvas.applyTransition();
        canvas.setPosition([canvasPosition[0] - (blockEndX - canvasEndX), canvasPosition[1]]);
      });
    }
  }, [engine, isOpened, blockID]);
};
