import React from 'react';

import { MAX_CLICK_TRAVEL } from '@/components/Canvas/constants';
import { useEnableDisable } from '@/hooks';
import { EngineContext, PresentationModeContext, useNode } from '@/pages/Canvas/contexts';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import MouseMovement from '@/utils/mouseMovement';

type Position = [number, number];

// eslint-disable-next-line import/prefer-default-export
export const useNodeDragApi = <N extends HTMLElement>() => {
  const {
    node: { x, y },
    nodeID,
  } = useNode();
  const engine = React.useContext(EngineContext)!;
  const editPermission = React.useContext(EditPermissionContext)!;
  const isPresentationMode = React.useContext(PresentationModeContext);

  const nodeRef = React.useRef<N>(null);
  const [isDragging, setDragging, unsetDragging] = useEnableDisable(false);
  const internalData = React.useRef({ position: [x, y] as Position, holdingShift: false, dragDistance: 0 });
  const mouseMovement = React.useMemo(() => new MouseMovement(), []);

  const updateTransform = React.useCallback((position: Position, callback?: () => void) => {
    const nodeEl = nodeRef.current!;

    window.requestAnimationFrame(() => {
      if (isPresentationMode) {
        nodeEl.style.left = `${position[0]}px`;
        nodeEl.style.top = `${position[1]}px`;
      } else {
        nodeEl.style.transform = `translate(${position[0]}px, ${position[1]}px)`;
      }

      callback?.();
    });
  }, []);

  const onClick = React.useCallback((event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    engine.setActivation(nodeID, internalData.current.holdingShift);
  }, []);

  const onDrag = React.useCallback(async (event: MouseEvent) => {
    if (engine.isNodeMovementLocked(nodeID)) {
      // abort drag if node is locked
      document.removeEventListener('mousemove', onDrag);
      return;
    }

    mouseMovement.track(event);

    const [movementX, movementY] = mouseMovement.getBoundedMovement();

    const zoom = engine.canvas!.getZoom();

    internalData.current.dragDistance += Math.max(Math.abs(movementX), Math.abs(movementY));

    await engine.dragNode(nodeID, [movementX / zoom, movementY / zoom]);
  }, []);

  const onDrop = React.useCallback(() => engine.dropNode(), []);

  const onMouseUp = React.useCallback(async (event: MouseEvent) => {
    teardownMouseListeners(); // eslint-disable-line @typescript-eslint/no-use-before-define

    // do not click in case double click event
    if (internalData.current.dragDistance < MAX_CLICK_TRAVEL && event.detail !== 2) {
      onClick(event);
    } else if (engine.drag.isTarget(nodeID)) {
      await onDrop();
    }

    internalData.current.dragDistance = 0;
    internalData.current.holdingShift = false;

    await engine.drag.reset();
  }, []);

  const teardownMouseListeners = React.useCallback(() => {
    mouseMovement.clear();

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onMouseUp);
  }, []);

  const addMouseListeners = React.useCallback(() => {
    if (!internalData.current.holdingShift) {
      document.addEventListener('mousemove', onDrag);
    }

    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent<N>) => {
      // don't capture right-click events
      if (event.button === 2) {
        return;
      }

      event.stopPropagation();

      if (editPermission.canEdit) {
        internalData.current.holdingShift = event.shiftKey;
        addMouseListeners();
      }
    },
    [editPermission.canEdit]
  );

  React.useEffect(() => () => teardownMouseListeners(), []);

  React.useEffect(() => {
    updateTransform([x, y], () => engine.node.redrawLinks(nodeID));
  }, [x, y]);

  const apiRef = React.useRef({
    translate: ([movementX, movementY]: Position) => {
      const { position } = internalData.current;

      const nextPosition: Position = [position[0] + movementX, position[1] + movementY];

      internalData.current.position = nextPosition;

      updateTransform(nextPosition);
    },

    forceDrag: () => {
      addMouseListeners();
      nodeRef.current?.focus();
    },

    drag: () => setDragging(),

    drop: () => unsetDragging(),

    getRect: () => nodeRef.current!.getBoundingClientRect(),

    getPosition: () => internalData.current.position,
  });

  return {
    api: apiRef.current,
    nodeRef,
    position: internalData.current.position,
    isDragging,
    onMouseDown,
  };
};
