import _throttle from 'lodash/throttle';
import React from 'react';

import * as UI from '@/ducks/ui';
import { useDispatch, useRAF, useSelector } from '@/hooks';
import useEngine from '@/pages/Canvas/engine';
import THEME from '@/styles/theme';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '@/styles/theme/projectPage';

const BASE_HOT_ZONE_SIZE = 150;
const AUTO_PAN_PIXEL_HOP_SIZE = 15;
const BASE_SCREEN_SIZE = 1500;
const SPEED_MULTIPLIER_CAP = 1;

const calculateSpeedMultiplier = (formula: number, hotZoneSize: number) => {
  const speedMultiplier = Math.abs(formula) / hotZoneSize;
  return Math.min(speedMultiplier, SPEED_MULTIPLIER_CAP);
};

const AutoPanLayer: React.FC = () => {
  const engine = useEngine();

  const isHidden = useSelector(UI.isCreatorMenuHiddenSelector);
  const setAutoPanning = useDispatch(UI.setIsAutopanning);

  const [scheduler, schedulerAPI] = useRAF();

  const leftOffset = !isHidden ? SIDEBAR_WIDTH + THEME.components.leftSidebar.width : SIDEBAR_WIDTH;

  React.useEffect(() => {
    let movementX = 0;
    let movementY = 0;
    let isLeftClick = false;

    const updateMergeDetection = _throttle((nodeID: string) => engine.merge.refreshCandidateDetection(nodeID), 150);

    const syncBlocksAndCursor = () => {
      const targets = engine.selection.getTargets();
      const soloTarget = engine.drag.target;
      const draggingNodeIDs = soloTarget ? [soloTarget] : targets;
      const draggableNode = draggingNodeIDs[0];

      if (!draggableNode) {
        return;
      }

      const zoom = engine.canvas!.getZoom();
      const onlySingleBlock = draggingNodeIDs.length === 1;

      if (onlySingleBlock) {
        updateMergeDetection(draggableNode);
      }

      engine.node.drag(draggableNode, [-movementX / zoom, -movementY / zoom], { translateFirst: true });
    };

    const syncLinkAndCursor = () => {
      const isDrawingLink = engine.linkCreation.isDrawing;
      if (isDrawingLink) {
        engine.linkCreation.redrawNewLink();
      }
    };

    const setCanvasPosition = (): void => {
      syncBlocksAndCursor();
      syncLinkAndCursor();

      setAutoPanning(true);
      const [posX, posY] = engine.canvas!.getPosition();
      engine.canvas!.setPosition([posX + movementX, posY + movementY]);

      scheduler(setCanvasPosition);
    };

    const allowAutoPan = () => {
      const isDrawingLink = engine.linkCreation.isDrawing;
      const isDraggingBlock = engine.drag.hasTarget;
      const isDraggingGroup = engine.drag.hasGroup;

      return isLeftClick && (isDrawingLink || isDraggingBlock || isDraggingGroup);
    };

    const onMouseUp = () => {
      isLeftClick = false;
      setAutoPanning(false);
      schedulerAPI.current.cancel();
    };

    const onMouseDown = (event: MouseEvent) => {
      isLeftClick = event.button === 0;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!allowAutoPan()) return;

      const { clientX, clientY } = event;
      const { top, right, left, bottom, height, width } = engine.canvas!.getCachedRect();
      const canvasDiagonalSize = Math.hypot(height, width);
      const screenSizeMultiplier = canvasDiagonalSize / BASE_SCREEN_SIZE;

      const hotZoneSize = BASE_HOT_ZONE_SIZE * screenSizeMultiplier;

      const xMid = width / 2 + leftOffset / 2;
      const yMid = height / 2 + HEADER_HEIGHT / 2;
      const distanceFromYCenter = yMid - clientY;
      const distanceFromXCenter = xMid - clientX;

      const inTopZone = clientY < top + hotZoneSize;
      const inLeftZone = clientX < left + hotZoneSize + leftOffset;
      const inRightZone = clientX > right - hotZoneSize;
      const inBottomZone = clientY > bottom - hotZoneSize;

      // right zone
      if (inRightZone) {
        const speedMultiplier = calculateSpeedMultiplier(right - hotZoneSize - clientX, hotZoneSize);

        movementY = (distanceFromYCenter / yMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementX = -AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        scheduler(setCanvasPosition);
      } else if (inLeftZone) {
        const speedMultiplier = calculateSpeedMultiplier(left + hotZoneSize + leftOffset - clientX, hotZoneSize);

        movementY = (distanceFromYCenter / yMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementX = AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        scheduler(setCanvasPosition);
      } else if (inTopZone) {
        const speedMultiplier = calculateSpeedMultiplier(hotZoneSize + HEADER_HEIGHT - clientY, hotZoneSize);

        movementX = (distanceFromXCenter / xMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementY = AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        scheduler(setCanvasPosition);
      } else if (inBottomZone) {
        const speedMultiplier = calculateSpeedMultiplier(bottom - hotZoneSize - clientY, hotZoneSize);

        movementX = (distanceFromXCenter / xMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementY = -AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        scheduler(setCanvasPosition);
      } else {
        setAutoPanning(false);
        schedulerAPI.current.cancel();
      }
    };

    const canvasNode = engine.canvas?.getRef();

    document.addEventListener('mouseup', onMouseUp);
    canvasNode?.addEventListener('mousedown', onMouseDown);
    canvasNode?.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      canvasNode?.removeEventListener('mousedown', onMouseDown);
      canvasNode?.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return null;
};

export default React.memo(AutoPanLayer);
