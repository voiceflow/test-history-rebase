import { Utils } from '@voiceflow/common';
import { NO_IN_PORT_NODES } from '@voiceflow/realtime-sdk';
import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import { DragItem, HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { EngineContext, ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { isMarkupBlockType } from '@/utils/typeGuards';
import * as Sentry from '@/vendors/sentry';

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

  const mergeSource = engine.getNodeByID(engine.merge.sourceNodeID);

  if (!mergeSource || isMarkupBlockType(mergeSource.type)) {
    return {
      mustNotBe: true,
    };
  }

  const parentNode = engine.getNodeByID(mergeSource.parentNode);
  if (mergeSource.parentNode && parentNode) {
    const sourceIndex = parentNode.combinedNodes.indexOf(mergeSource.id);

    return {
      mustNotBe: parentNodeID === mergeSource.parentNode && Utils.number.isInRange(index, sourceIndex, sourceIndex + 1),
      mustBeFirst: NO_IN_PORT_NODES.has(mergeSource.type),
      mustBeLast: getManager(mergeSource.type)?.mergeTerminator,
    };
  }

  const [firstChildNodeID] = mergeSource.combinedNodes;
  const firstChildNode = engine.getNodeByID(firstChildNodeID);
  const lastChildNodeID = mergeSource.combinedNodes[mergeSource.combinedNodes.length - 1];
  const lastChildNode = engine.getNodeByID(lastChildNodeID);

  return {
    mustBeFirst: !!firstChildNode?.type && NO_IN_PORT_NODES.has(firstChildNode.type),
    mustBeLast: !!lastChildNode?.type && getManager(lastChildNode.type)?.mergeTerminator,
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

    drop: () => {
      const { type, factoryData } = engine.merge.virtualSource!;

      engine.node.insertStepV2(engine.merge.targetNodeID!, type, index, { factoryData }).catch(Sentry.error);

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
