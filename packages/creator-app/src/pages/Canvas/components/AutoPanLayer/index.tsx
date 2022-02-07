import _throttle from 'lodash/throttle';
import React from 'react';

import { AutoPanningContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as UI from '@/ducks/ui';
import { useDidUpdateEffect, useRAF, useSelector } from '@/hooks';
import useEngine from '@/pages/Canvas/engine';
import { useEditingMode } from '@/pages/Project/hooks';
import THEME from '@/styles/theme';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '@/styles/theme/projectPage';
import { applyMinMaxCap } from '@/utils/math';

const AUTO_PAN_PIXEL_HOP_SIZE = 15;
const SPEED_MULTIPLIER_CAP = 1;

const HOT_ZONE_MIN = 20;
const HOT_ZONE_MAX = 48;

const HORIZONTAL_HOT_ZONE_PERCENT = 0.025;
const VERTICAL_HOT_ZONE_PERCENT = 0.045;

const calculateSpeedMultiplier = (formula: number, hotZoneSize: number) => {
  const speedMultiplier = Math.abs(formula) / hotZoneSize;
  return Math.min(speedMultiplier, SPEED_MULTIPLIER_CAP);
};

const AutoPanLayer: React.FC = () => {
  const engine = useEngine();
  const isCreatorMenuHidden = useSelector(UI.isCreatorMenuHiddenSelector);
  const isEditingMode = useEditingMode();
  const disableNewStepPanningRef = React.useRef(false);
  const mouseMoveRef = React.useRef<MouseEvent | null>(null);
  const [draggingNewStep, setDraggingNewStep] = React.useState(false);

  const hasFocusedNode = !!useSelector(Creator.creatorFocusSelector)?.isActive;
  const blockEditorOpened = isEditingMode && hasFocusedNode;

  const getNodeByID = useSelector(CreatorV2.getNodeByIDSelector);
  const { isAutoPanning } = React.useContext(AutoPanningContext);

  const leftOffsetRef = React.useRef<number>(0);
  const rightOffsetRef = React.useRef<number>(0);

  const [scheduler, schedulerAPI] = useRAF();

  useDidUpdateEffect(() => {
    disableNewStepPanningRef.current = draggingNewStep;
    if (!draggingNewStep) reset();
  }, [draggingNewStep]);

  React.useEffect(() => {
    leftOffsetRef.current = !isCreatorMenuHidden ? SIDEBAR_WIDTH + THEME.components.leftSidebar.width : SIDEBAR_WIDTH;
  }, [isCreatorMenuHidden]);

  React.useEffect(() => {
    rightOffsetRef.current = blockEditorOpened ? THEME.components.blockSidebar.width : 0;
  }, [blockEditorOpened]);

  const reset = () => {
    isAutoPanning.current = false;
    schedulerAPI.current.cancel();
  };

  React.useEffect(() => {
    let movementX = 0;
    let movementY = 0;
    let isLeftClick = false;

    const updateMergeDetection = _throttle((nodeID: string) => engine.merge.refreshCandidateDetection(nodeID), 150);

    const syncBlocksAndCursor = () => {
      const isDrawingLink = engine.linkCreation.isDrawing;
      const targets = engine.selection.getTargets();
      const soloTarget = engine.drag.target;
      const draggingNodeIDs = soloTarget ? [soloTarget] : targets;
      const draggableNode = draggingNodeIDs[0];

      if (!draggableNode || isDrawingLink) {
        return;
      }

      const isDraggingChildStep = getNodeByID({ id: draggableNode })?.parentNode;

      const zoom = engine.canvas!.getZoom();
      const onlySingleBlock = draggingNodeIDs.length === 1;

      if (isDraggingChildStep) {
        engine.merge?.components?.mergeLayer?.handleMouseMove(mouseMoveRef.current!);
      }
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

      isAutoPanning.current = true;
      const [posX, posY] = engine.canvas!.getPosition();
      engine.canvas!.setPosition([posX + movementX, posY + movementY]);

      scheduler(setCanvasPosition);
    };

    const allowAutoPan = () => {
      const isDrawingLink = engine.linkCreation.isDrawing;
      const isDraggingBlock = engine.drag.hasTarget;
      const isDraggingGroup = engine.drag.hasGroup;
      const isDraggingNewStep = engine.drag.isDraggingToCreate;
      setDraggingNewStep(isDraggingNewStep);
      return isDraggingNewStep || (isLeftClick && (isDrawingLink || isDraggingBlock || isDraggingGroup));
    };

    const onMouseUp = () => {
      isLeftClick = false;
      reset();
    };

    const onMouseDown = (event: MouseEvent) => {
      isLeftClick = event.button === 0;
    };

    // For dragging from step menu
    const onDrag = (event: MouseEvent) => {
      if (allowAutoPan()) {
        onMouseMove(event);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      mouseMoveRef.current = event;
      if (!allowAutoPan()) {
        return;
      }

      const leftOffset = leftOffsetRef.current;
      const rightOffset = rightOffsetRef.current;

      const { clientX, clientY } = event;
      const { top, right, left, bottom, height, width } = engine.canvas!.getCachedRect();

      const verticalHotZoneSize = applyMinMaxCap(HOT_ZONE_MIN, HOT_ZONE_MAX, height * VERTICAL_HOT_ZONE_PERCENT);
      const horizontalHotZoneSize = applyMinMaxCap(HOT_ZONE_MIN, HOT_ZONE_MAX, width * HORIZONTAL_HOT_ZONE_PERCENT);

      const xMid = width / 2 + leftOffset / 2;
      const yMid = height / 2 + HEADER_HEIGHT / 2;
      const distanceFromYCenter = yMid - clientY;
      const distanceFromXCenter = xMid - clientX;

      const inTopZone = clientY < top + verticalHotZoneSize;
      const inLeftZone = clientX < left + horizontalHotZoneSize + leftOffset;
      const inRightZone = clientX > right - horizontalHotZoneSize - rightOffset;
      const inBottomZone = clientY > bottom - verticalHotZoneSize;

      const notInAnyZone = !inTopZone && !inLeftZone && !inRightZone && !inBottomZone;

      // Once the user drags a new step into the middle of the canvas, unlock the left hot zone
      if (disableNewStepPanningRef.current && notInAnyZone) {
        disableNewStepPanningRef.current = false;
        return;
      }

      if (notInAnyZone || disableNewStepPanningRef.current) {
        reset();
        return;
      }

      if (inRightZone) {
        const speedMultiplier = calculateSpeedMultiplier(right - horizontalHotZoneSize - rightOffset - clientX, horizontalHotZoneSize);

        movementY = (distanceFromYCenter / yMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementX = -AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        scheduler(setCanvasPosition);
      } else if (inLeftZone) {
        const speedMultiplier = calculateSpeedMultiplier(left + horizontalHotZoneSize + leftOffset - clientX, horizontalHotZoneSize);

        movementY = (distanceFromYCenter / yMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementX = AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        scheduler(setCanvasPosition);
      } else if (inTopZone) {
        const speedMultiplier = calculateSpeedMultiplier(verticalHotZoneSize + HEADER_HEIGHT - clientY, verticalHotZoneSize);

        movementX = (distanceFromXCenter / xMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementY = AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        scheduler(setCanvasPosition);
      } else if (inBottomZone) {
        const speedMultiplier = calculateSpeedMultiplier(bottom - verticalHotZoneSize - clientY, verticalHotZoneSize);

        movementX = (distanceFromXCenter / xMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementY = -AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        scheduler(setCanvasPosition);
      }
    };

    const canvasNode = engine.canvas?.getRef();

    document.addEventListener('mouseup', onMouseUp);

    // Using the 'drag' event instead has this weird issue where dragging offscreen resets the mouse event
    // position to 0, causing panning bugs, dragover seems to fix this
    canvasNode?.addEventListener('dragover', onDrag);
    canvasNode?.addEventListener('mousedown', onMouseDown);
    canvasNode?.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      canvasNode?.addEventListener('dragover', onDrag);
      canvasNode?.removeEventListener('mousedown', onMouseDown);
      canvasNode?.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return null;
};

export default React.memo(AutoPanLayer);
