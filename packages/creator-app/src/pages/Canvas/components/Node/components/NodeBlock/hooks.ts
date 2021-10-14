import { NO_IN_PORT_NODES } from '@voiceflow/realtime-sdk';
import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import { DragItem, HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { EngineContext, ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { objectID } from '@/utils';
import { isInRange } from '@/utils/number';
import { isMarkupBlockType } from '@/utils/typeGuards';

export const useMergeInfo = (index: number) => {
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;
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
      mustBeFirst: NO_IN_PORT_NODES.has(type),
      mustBeLast: getManager(type)?.mergeTerminator,
    };
  }

  const mergeSource = engine.getNodeByID(engine.merge.sourceNodeID!);

  if (!mergeSource || isMarkupBlockType(mergeSource.type)) {
    return {
      mustNotBe: true,
    };
  }

  if (mergeSource.parentNode) {
    const parentNode = engine.getNodeByID(mergeSource.parentNode);
    const sourceIndex = parentNode.combinedNodes.indexOf(mergeSource.id);

    return {
      mustNotBe: parentNodeID === mergeSource.parentNode && isInRange(index, sourceIndex, sourceIndex + 1),
      mustBeFirst: NO_IN_PORT_NODES.has(mergeSource.type),
      mustBeLast: getManager(mergeSource.type)?.mergeTerminator,
    };
  }

  const [firstChildNodeID] = mergeSource.combinedNodes;
  const firstChildNode = engine.getNodeByID(firstChildNodeID);
  const lastChildNodeID = mergeSource.combinedNodes[mergeSource.combinedNodes.length - 1];
  const lastChildNode = engine.getNodeByID(lastChildNodeID);

  return {
    mustBeFirst: NO_IN_PORT_NODES.has(firstChildNode?.type),
    mustBeLast: getManager(lastChildNode?.type)?.mergeTerminator,
  };
};

export const useDnDHoverReorderIndicator = (index: number) => {
  const engine = React.useContext(EngineContext)!;
  const isHoveredLocal = React.useRef(false);
  const [isHovered, setHovered] = React.useState(false);

  const [, connectBlockDrop] = useDrop({
    accept: [DragItem.BLOCK_MENU, DragItem.COMPONENTS],

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

  React.useEffect(
    () => () => {
      connectBlockDrop(null);
    },
    [connectBlockDrop]
  );

  return [connectBlockDrop, isHovered] as const;
};
