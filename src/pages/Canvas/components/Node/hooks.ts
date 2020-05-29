import React from 'react';

import { useLinkedRef } from '@/hooks';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { BlockAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';

import { InternalNodeInstance } from './types';

export const useNodePosition = () => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { x, y } = nodeEntity.useState((e) => {
    const { node } = e.resolve();

    return { x: node.x, y: node.y };
  });
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

  const updateTransform = React.useCallback(([x, y]: Point, callback?: () => void) => {
    const nodeEl = ref.current!;

    window.requestAnimationFrame(() => {
      nodeEl.style.transform = `translate(${x}px, ${y}px)`;

      callback?.();
    });
  }, []);

  const getRect = React.useCallback(() => blockRef.current?.getRect() || null, []);

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
      translate: ([movementX, movementY]) => {
        const [posX, posY] = position.current!;
        const nextPosition: Point = [posX + movementX, posY + movementY];
        position.current = nextPosition;

        updateTransform(nextPosition);
      },
    }),
    [elementInstance]
  );
};
