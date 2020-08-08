import React from 'react';

import { useLinkedRef } from '@/hooks';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { useDragTranslate, useEntityDrag } from '@/pages/Canvas/hooks';
import { BlockAPI } from '@/pages/Canvas/types';
import { useEditingMode } from '@/pages/Skill/hooks';
import { Point } from '@/types';

import { InternalNodeInstance } from './types';

export const useNodePosition = () => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { x, y } = nodeEntity.useCoordinates();

  const nodePosition = React.useMemo<Point>(() => [x, y], [x, y]);

  React.useEffect(() => {
    engine.node.redrawLinks(nodeEntity.nodeID);
  }, [x, y]);

  return useLinkedRef(nodePosition);
};

export const useNodeInstance = <T extends HTMLElement>(): InternalNodeInstance<T> => {
  const ref = React.useRef<T | null>(null);
  const blockRef = React.useRef<BlockAPI>(null);
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const position = useNodePosition();

  const translate = useDragTranslate(ref, position);

  const getRect = React.useCallback(() => {
    return blockRef.current?.getRect() || null;
  }, []);

  const elementInstance = useElementInstance(ref);

  return React.useMemo<InternalNodeInstance<T>>(
    () => ({
      ...elementInstance,

      ref,
      blockRef,
      position,
      getRect,

      getPosition: () => position.current!,
      getCenterPoint: () => {
        const node = engine.getNodeByID(nodeEntity.nodeID);

        return [node.x, node.y];
      },
      rename: () => blockRef.current?.rename(),
      translate,
    }),
    [elementInstance]
  );
};

export const useNodeDrag = ({ skipClick, skipDrag }: { skipClick?: () => boolean; skipDrag?: () => boolean } = {}) => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const isEditingMode = useEditingMode();

  const onClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.defaultPrevented || skipClick?.()) return;

      event.preventDefault();

      engine.setActive(nodeEntity.nodeID, event.shiftKey);
    },
    [skipClick]
  );

  const onDragStart = useEntityDrag(
    {
      skipDrag: () => !isEditingMode || engine.isNodeMovementLocked(nodeEntity.nodeID) || !!skipDrag?.(),
      drag: (movement) => engine.node.drag(nodeEntity.nodeID, movement),
      drop: async () => {
        if (engine.drag.isTarget(nodeEntity.nodeID)) {
          await engine.node.drop();
        }
        await engine.drag.reset();
      },
    },
    [isEditingMode, skipDrag]
  );

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (!isEditingMode) return;

      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    },
    [isEditingMode]
  );

  return {
    onClick,
    onDragStart,
    onMouseDown,
  };
};
