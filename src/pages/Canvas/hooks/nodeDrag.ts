import React from 'react';

import { MAX_CLICK_TRAVEL } from '@/components/Canvas/constants';
import { useTeardown } from '@/hooks';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { noop } from '@/utils/functional';
import MouseMovement from '@/utils/mouseMovement';

// eslint-disable-next-line import/prefer-default-export
export const useNodeDrag = () => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const editPermission = React.useContext(EditPermissionContext)!;

  const isHoldingShift = React.useRef(false);
  const teardownMouseListeners = React.useRef(noop);
  const dragDistance = React.useRef(0);
  const mouseMovement = React.useMemo(() => new MouseMovement(), []);

  const onClick = React.useCallback((event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (isHoldingShift.current) {
      engine.selection.toggle(nodeEntity.nodeID);
    } else {
      engine.focus.set(nodeEntity.nodeID);
    }
  }, []);

  const onDrag = React.useCallback(async (event: MouseEvent) => {
    if (engine.isNodeMovementLocked(nodeEntity.nodeID)) {
      // abort drag if node is locked
      document.removeEventListener('mousemove', onDrag);
      return;
    }

    mouseMovement.track(event);

    const [movementX, movementY] = mouseMovement.getBoundedMovement();

    const zoom = engine.canvas!.getZoom();

    dragDistance.current += Math.max(Math.abs(movementX), Math.abs(movementY));

    await engine.node.drag(nodeEntity.nodeID, [movementX / zoom, movementY / zoom]);
  }, []);

  const onDrop = React.useCallback(() => engine.node.drop(), []);

  const onMouseUp = React.useCallback(
    async (event: MouseEvent) => {
      teardownMouseListeners.current();

      // do not click in case double click event
      if (dragDistance.current < MAX_CLICK_TRAVEL && event.detail !== 2) {
        onClick(event);
      } else if (engine.drag.isSoleTarget(nodeEntity.nodeID)) {
        await onDrop();
      }

      dragDistance.current = 0;
      isHoldingShift.current = false;

      await engine.drag.reset();
    },
    [onClick, onDrop]
  );

  const addMouseListeners = React.useCallback(() => {
    if (!isHoldingShift.current) {
      document.addEventListener('mousemove', onDrag);
    }

    document.addEventListener('mouseup', onMouseUp);

    teardownMouseListeners.current = () => {
      mouseMovement.clear();

      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onDrag, onMouseUp]);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      // don't capture right-click events
      if (event.button !== 2) {
        event.stopPropagation();

        if (editPermission.canEdit) {
          isHoldingShift.current = event.shiftKey;
          addMouseListeners();
        }
      }
    },
    [editPermission.canEdit, addMouseListeners]
  );

  useTeardown(() => teardownMouseListeners.current());

  return {
    onMouseDown,
  };
};
