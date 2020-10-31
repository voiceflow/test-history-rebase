import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import { BlockType, DragItem, HOVER_THROTTLE_TIMEOUT, MARKUP_NODES } from '@/constants';
import { EngineContext, ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { objectID } from '@/utils';
import { isInRange } from '@/utils/number';

export const useMergeInfo = (index: number) => {
  const getManager = React.useContext(ManagerContext)!;
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { parentNodeID } = nodeEntity.useState((e) => ({
    parentNodeID: e.resolve().node.parentNode,
  }));

  if (!engine.merge.hasSource) {
    return {
      mustNotBe: true,
    };
  }

  if (engine.merge.virtualSource) {
    const { type } = engine.merge.virtualSource;

    return {
      mustBeFirst: type === BlockType.INTENT,
      mustBeLast: getManager(type)?.mergeTerminator,
    };
  }

  const mergeSource = engine.getNodeByID(engine.merge.sourceNodeID!);

  if (!mergeSource || MARKUP_NODES.includes(mergeSource.type)) {
    return {
      mustNotBe: true,
    };
  }

  if (mergeSource.parentNode) {
    const parentNode = engine.getNodeByID(mergeSource.parentNode);
    const sourceIndex = parentNode.combinedNodes.indexOf(mergeSource.id);

    return {
      mustNotBe: parentNodeID === mergeSource.parentNode && isInRange(index, sourceIndex, sourceIndex + 1),
      mustBeFirst: mergeSource.type === BlockType.INTENT,
      mustBeLast: getManager(mergeSource.type)?.mergeTerminator,
    };
  }

  const [firstChildNodeID] = mergeSource.combinedNodes;
  const firstChildNode = engine.getNodeByID(firstChildNodeID);
  const lastChildNodeID = mergeSource.combinedNodes[mergeSource.combinedNodes.length - 1];
  const lastChildNode = engine.getNodeByID(lastChildNodeID);

  return {
    mustBeFirst: firstChildNode?.type === BlockType.INTENT,
    mustBeLast: getManager(lastChildNode?.type)?.mergeTerminator,
  };
};

export const useDnDHoverReorderIndicator = (index: number) => {
  const engine = React.useContext(EngineContext)!;
  const isHoveredLocal = React.useRef(false);
  const [isHovered, setHovered] = React.useState(false);

  const [, connectBlockDrop] = useDrop({
    accept: DragItem.BLOCK_MENU,

    hover: _throttle(
      () => {
        if (!isHoveredLocal.current) {
          engine.merge.setTargetStep(index, () => {
            isHoveredLocal.current = false;
            setHovered(false);
          });
        }

        isHoveredLocal.current = true;
        setHovered(true);
      },
      HOVER_THROTTLE_TIMEOUT,
      { trailing: false }
    ),

    drop: (_, monitor) => {
      const newNodeID = objectID();
      const { type, factoryData } = engine.merge.virtualSource!;

      const { x: mouseX, y: mouseY } = monitor.getClientOffset()!;

      const position = engine.canvas!.transformPoint([mouseX, mouseY]);

      engine.node.addNestedV2({
        type,
        index,
        nodeID: newNodeID,
        position,
        factoryData,
        parentNodeID: engine.merge.targetNodeID!,
      });

      return { captured: true };
    },
  });

  return [connectBlockDrop, isHovered] as const;
};
