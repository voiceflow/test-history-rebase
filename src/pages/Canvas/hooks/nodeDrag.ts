import React from 'react';

import { useTeardown } from '@/hooks';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { noop } from '@/utils/functional';
import MouseMovement from '@/utils/mouseMovement';

// eslint-disable-next-line import/prefer-default-export
export const useNodeDrag = ({ skipClick, skipDrag }: { skipClick?: () => boolean; skipDrag?: () => boolean } = {}) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const editPermission = React.useContext(EditPermissionContext)!;

  const isDragging = React.useRef(false);
  const teardownMouseListeners = React.useRef(noop);
  const mouseMovement = React.useMemo(() => new MouseMovement(), []);

  const onClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.defaultPrevented || skipClick?.()) return;

      event.preventDefault();

      engine.setActive(nodeEntity.nodeID, event.shiftKey);
    },
    [skipClick]
  );

  const onDrag = React.useCallback(async (event: MouseEvent) => {
    mouseMovement.track(event);

    const [movementX, movementY] = mouseMovement.getBoundedMovement();

    const zoom = engine.canvas!.getZoom();

    await engine.node.drag(nodeEntity.nodeID, [movementX / zoom, movementY / zoom]);
  }, []);

  const addMouseListeners = React.useCallback(() => {
    document.addEventListener('mousemove', onDrag);

    teardownMouseListeners.current = () => {
      mouseMovement.clear();

      document.removeEventListener('mousemove', onDrag);
    };
  }, [onDrag]);

  const onDragStart = React.useCallback(
    (dragEvent: React.DragEvent) => {
      if (dragEvent.defaultPrevented || !editPermission.canEdit || engine.isNodeMovementLocked(nodeEntity.nodeID) || skipDrag?.()) return;

      dragEvent.preventDefault();

      isDragging.current = true;

      addMouseListeners();

      document.addEventListener(
        'mouseup',
        async (event) => {
          event.preventDefault();

          isDragging.current = false;
          teardownMouseListeners.current();

          if (engine.drag.isSoleTarget(nodeEntity.nodeID)) {
            await engine.node.drop();
          }

          await engine.drag.reset();
        },
        { once: true }
      );
    },
    [editPermission.canEdit, addMouseListeners]
  );

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (editPermission.canEdit) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
      }
    },
    [editPermission.canEdit]
  );

  useTeardown(() => teardownMouseListeners.current());

  return {
    onClick,
    onDragStart,
    onMouseDown,
  };
};
