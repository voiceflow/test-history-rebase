import * as Realtime from '@voiceflow/realtime-sdk';
import _throttle from 'lodash/throttle';
import React from 'react';

import { AutoPanningCacheContext, AutoPanningSetContext } from '@/contexts/AutoPanningContext';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as UI from '@/ducks/ui';
import { useEventualEngine, useRAF, useSelector } from '@/hooks';
import { useEditingMode } from '@/pages/Project/hooks';
import THEME from '@/styles/theme';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '@/styles/theme/page';
import { applyMinMaxCap } from '@/utils/math';

import { EntityType } from '../../engine/constants';

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
  const getEngine = useEventualEngine();
  const canvasSidebar = useSelector(UI.selectors.canvasSidebar);
  const isEditingMode = useEditingMode();
  const disableNewStepPanningRef = React.useRef(false);
  const isDraggingNewStepRef = React.useRef(false);
  const mouseMoveRef = React.useRef<MouseEvent | null>(null);

  const hasFocusedNode = !!useSelector(CreatorV2.creatorFocusSelector)?.isActive;
  const blockEditorOpened = isEditingMode && hasFocusedNode;

  const getNodeByID = useSelector(CreatorV2.getNodeByIDSelector);
  const setAutoPanning = React.useContext(AutoPanningSetContext);
  const autoPanningCache = React.useContext(AutoPanningCacheContext);

  const leftOffsetRef = React.useRef<number>(0);
  const rightOffsetRef = React.useRef<number>(0);

  const [scheduler, schedulerAPI] = useRAF();

  React.useEffect(() => {
    leftOffsetRef.current = !canvasSidebar?.visible
      ? SIDEBAR_WIDTH + THEME.components.leftSidebar.width
      : SIDEBAR_WIDTH;
  }, [canvasSidebar]);

  React.useEffect(() => {
    rightOffsetRef.current = blockEditorOpened ? THEME.components.blockSidebar.width : 0;
  }, [blockEditorOpened]);

  const reset = () => {
    setAutoPanning(false);
    schedulerAPI.current.cancel();
  };

  React.useEffect(() => {
    const engine = getEngine();

    if (!engine || !engine.canvas) return undefined;

    let movementX = 0;
    let movementY = 0;
    let isLeftClick = false;

    const updateMergeDetection = _throttle(
      (nodeID: string) => getEngine()?.merge.refreshCandidateDetection(nodeID),
      150
    );

    const syncBlocksAndCursor = () => {
      const isDrawingLink = engine.linkCreation.isDrawing;
      const targets = engine.selection.getTargets(EntityType.NODE);
      const soloTarget = engine.drag.target;
      const draggingNodeIDs = soloTarget ? [soloTarget] : targets;
      const draggableNode = draggingNodeIDs[0];

      if (!draggableNode || isDrawingLink) {
        return;
      }

      const isDraggingChildStep = getNodeByID({ id: draggableNode })?.parentNode;

      const zoom = engine.canvas?.getZoom() ?? 1;
      const onlySingleBlock = draggingNodeIDs.length === 1;

      if (isDraggingChildStep && mouseMoveRef.current) {
        engine.merge.components?.mergeLayer?.handleMouseMove(mouseMoveRef.current);
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

    const syncCanvas = () => {
      const [posX, posY] = engine.canvas?.getPosition() ?? [0, 0];
      engine.canvas?.setPosition([posX + movementX, posY + movementY]);
    };

    const setCanvasPosition = (): void => {
      if (!autoPanningCache.current) {
        reset();
        return;
      }

      if (engine.isFeatureEnabled(Realtime.FeatureFlag.EXPERIMENTAL_SYNC_LINKS)) {
        syncCanvas();
      }

      syncBlocksAndCursor();
      syncLinkAndCursor();

      if (!engine.isFeatureEnabled(Realtime.FeatureFlag.EXPERIMENTAL_SYNC_LINKS)) {
        syncCanvas();
      }

      scheduler(setCanvasPosition);
    };

    const allowAutoPan = (): boolean => {
      const isDrawingLink = engine.linkCreation.isDrawing;
      const isDraggingBlock = engine.drag.hasTarget;
      const isDraggingGroup = engine.drag.hasGroup;
      const isDraggingNewStep = engine.drag.isDraggingToCreate;

      if (isDraggingNewStep !== isDraggingNewStepRef.current) {
        isDraggingNewStepRef.current = isDraggingNewStep;
        // disableNewStepPanningRef has other logic acting on it in `onMouseMove` and can maintain a separate state
        disableNewStepPanningRef.current = isDraggingNewStep;
      }

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

      if (!allowAutoPan() || !engine.canvas) {
        return;
      }

      const leftOffset = leftOffsetRef.current;
      const rightOffset = rightOffsetRef.current;

      const { clientX, clientY } = event;
      const { top = 0, right = 0, left = 0, bottom = 0, height = 0, width = 0 } = engine.canvas.getRect();

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

      const startPanning = () => {
        setAutoPanning(true);

        scheduler(setCanvasPosition);
      };

      if (inRightZone) {
        const speedMultiplier = calculateSpeedMultiplier(
          right - horizontalHotZoneSize - rightOffset - clientX,
          horizontalHotZoneSize
        );

        movementY = (distanceFromYCenter / yMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementX = -AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        startPanning();
      } else if (inLeftZone) {
        const speedMultiplier = calculateSpeedMultiplier(
          left + horizontalHotZoneSize + leftOffset - clientX,
          horizontalHotZoneSize
        );

        movementY = (distanceFromYCenter / yMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementX = AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        startPanning();
      } else if (inTopZone) {
        const speedMultiplier = calculateSpeedMultiplier(
          verticalHotZoneSize + HEADER_HEIGHT - clientY,
          verticalHotZoneSize
        );

        movementX = (distanceFromXCenter / xMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementY = AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        startPanning();
      } else if (inBottomZone) {
        const speedMultiplier = calculateSpeedMultiplier(bottom - verticalHotZoneSize - clientY, verticalHotZoneSize);

        movementX = (distanceFromXCenter / xMid) * AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;
        movementY = -AUTO_PAN_PIXEL_HOP_SIZE * speedMultiplier;

        startPanning();
      }
    };

    const canvasNode = engine.canvas.getRef();

    document.addEventListener('mouseup', onMouseUp);

    // Using the 'drag' event instead has this weird issue where dragging offscreen resets the mouse event
    // position to 0, causing panning bugs, dragover seems to fix this
    canvasNode?.addEventListener('dragover', onDrag);
    canvasNode?.addEventListener('mousedown', onMouseDown);
    canvasNode?.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      canvasNode?.removeEventListener('dragover', onDrag);
      canvasNode?.removeEventListener('mousedown', onMouseDown);
      canvasNode?.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return null;
};

export default React.memo(AutoPanLayer);
