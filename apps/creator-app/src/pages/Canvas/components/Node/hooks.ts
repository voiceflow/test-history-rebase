import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useLinkedRef, useRAF } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';
import { ContextMenuContext, EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { useEntityDrag } from '@/pages/Canvas/hooks/drag';
import { CombinedAPI } from '@/pages/Canvas/types';
import { useEditingMode } from '@/pages/Project/hooks';
import { Pair, Point } from '@/types';

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
  const nodeRef = React.useRef<CombinedAPI>(null);
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const position = useNodePosition();
  const experimentalSyncLinks = useFeature(Realtime.FeatureFlag.EXPERIMENTAL_SYNC_LINKS);

  const getRect = React.useCallback(() => nodeRef.current?.getRect() || null, []);

  const elementInstance = useElementInstance(ref);
  const [stylesScheduler] = useRAF();

  return React.useMemo<InternalNodeInstance<T>>(
    () => ({
      ...elementInstance,

      ref,
      nodeRef,
      position,
      getRect,
      getPosition: () => position.current!,
      getThreadAnchorCoords: () => engine.canvas!.toCoords(position.current!),
      getCenterPoint: () => {
        const node = engine.getNodeByID(nodeEntity.nodeID);
        if (!node) return null;

        return [node.x, node.y];
      },
      rename: () => nodeRef.current?.rename(),
      blur: () => ref.current?.blur(),
      translate: ([movementX, movementY]: Pair<number>, onStylesApplied?: VoidFunction) => {
        if (!position.current) return;

        const [posX, posY] = position.current;

        position.current = [posX + movementX, posY + movementY];

        stylesScheduler(() => {
          if (!position.current || !ref.current) return;

          ref.current.style.transform = `translate(${position.current[0]}px, ${position.current[1]}px)`;

          if (experimentalSyncLinks) {
            engine.node.translateAllLinks(nodeEntity.nodeID, [movementX, movementY], { sync: true });
          }

          onStylesApplied?.();
        });
      },
    }),
    [elementInstance, experimentalSyncLinks]
  );
};

export const useNodeDrag = ({ skipClick, skipDrag }: { skipClick?: () => boolean; skipDrag?: () => boolean } = {}) => {
  const engine = React.useContext(EngineContext)!;
  const contextMenu = React.useContext(ContextMenuContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const isEditingMode = useEditingMode();

  const onClick = (event: React.MouseEvent) => {
    if (event.defaultPrevented || skipClick?.()) return;

    event.preventDefault();

    const node = engine.select(CreatorV2.nodeByIDSelector, { id: nodeEntity.nodeID });
    if (!node) return;

    if (!event.shiftKey && node.type === BlockType.COMBINED && node.combinedNodes.length) {
      engine.setActive(node.combinedNodes[0]);
    } else {
      engine.setActive(nodeEntity.nodeID, { isSelection: event.shiftKey });
    }
  };

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

  const onMouseDown = (event: React.MouseEvent) => {
    if (!isEditingMode) return;

    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  };

  const onMouseUp = (event: React.MouseEvent) => {
    if (
      !isEditingMode ||
      event.ctrlKey ||
      event.shiftKey ||
      event.button === 1 ||
      contextMenu.isOpen ||
      engine.prototype.isActive ||
      engine.comment.isModeActive ||
      engine.linkCreation.isDrawing ||
      engine.groupSelection.isDrawing
    ) {
      return;
    }

    event.preventDefault();
    engine.clearActivation({ skipUrlSync: true });
  };

  return {
    onClick,
    onMouseUp,
    onDragStart,
    onMouseDown,
  };
};
