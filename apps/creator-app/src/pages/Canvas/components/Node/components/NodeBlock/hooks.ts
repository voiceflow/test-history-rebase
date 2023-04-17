import { datadogRum } from '@datadog/browser-rum';
import { Utils } from '@voiceflow/common';
import { NO_IN_PORT_NODES } from '@voiceflow/realtime-sdk';
import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import { BlockType, DragItem, HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { EngineContext, ManagerContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { isNodeEntityResource } from '@/pages/Canvas/engine/entities/nodeEntity';
import { NodeEntityResource } from '@/pages/Canvas/managers/types';
import { isMarkupBlockType } from '@/utils/typeGuards';

export const useMergeInfo = (index: number) => {
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const isMergeTerminator = (type: BlockType, nodeEntityResource?: Partial<NodeEntityResource<unknown>> | { data: null }) => {
    const manager = getManager(type);
    if (manager.mergeTerminator) return true;

    return isNodeEntityResource(nodeEntityResource) && manager.isMergeTerminator?.(nodeEntityResource);
  };

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
      mustBeLast: isMergeTerminator(type),
    };
  }

  const mergeSource = engine.getNodeByID(engine.merge.sourceNodeID);

  if (!engine.merge.sourceNodeID || !mergeSource || isMarkupBlockType(mergeSource.type)) {
    return {
      mustNotBe: true,
    };
  }

  const parentNode = engine.getNodeByID(mergeSource.parentNode);
  if (mergeSource.parentNode && parentNode) {
    const sourceIndex = parentNode.combinedNodes.indexOf(mergeSource.id);
    const mergeSourceData = engine.getDataByNodeID(engine.merge.sourceNodeID);
    return {
      mustNotBe: parentNodeID === mergeSource.parentNode && Utils.number.isInRange(index, sourceIndex, sourceIndex + 1),
      mustBeFirst: NO_IN_PORT_NODES.has(mergeSource.type),
      mustBeLast: isMergeTerminator(mergeSource.type, { data: mergeSourceData, node: mergeSource }),
    };
  }

  const [firstChildNodeID] = mergeSource.combinedNodes;
  const firstChildNode = engine.getNodeByID(firstChildNodeID);
  const lastChildNodeID = mergeSource.combinedNodes[mergeSource.combinedNodes.length - 1];
  const lastChildNode = engine.getNodeByID(lastChildNodeID);
  const lastChildNodeData = engine.getDataByNodeID(lastChildNodeID);

  return {
    mustBeFirst: !!firstChildNode?.type && NO_IN_PORT_NODES.has(firstChildNode.type),
    mustBeLast: !!lastChildNode?.type && isMergeTerminator(lastChildNode.type, { data: lastChildNodeData, node: lastChildNode }),
  };
};

const ACCEPTED_DROP_ITEMS = [DragItem.BLOCK_MENU, DragItem.COMPONENTS, DragItem.LIBRARY];

export const useDnDHoverReorderIndicator = (index: number) => {
  const engine = React.useContext(EngineContext)!;
  const isHoveredLocal = React.useRef(false);
  const [isHovered, setHovered] = React.useState(false);

  const [, connectBlockDrop] = useDrop({
    accept: ACCEPTED_DROP_ITEMS,
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
      const { type, factoryData, extra } = engine.merge.virtualSource!;
      if (type === BlockType.COMBINED && extra?.nodes) {
        engine.node.insertManySteps(engine.merge.targetNodeID!, extra.nodes, index).catch(datadogRum.addError);

        if (extra.meta?.templateID) {
          engine.canvasTemplate.trackTemplateUsed({
            templateID: extra.meta.templateID,
            nodeIDs: extra.nodes.map((node) => node.nodeID),
            droppedInto: 'block',
          });
        }
      } else {
        engine.node.insertStep(engine.merge.targetNodeID!, type, index, { factoryData }).catch(datadogRum.addError);
      }

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
