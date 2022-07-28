import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _sortBy from 'lodash/sortBy';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as CreatorV1Selectors from '@/ducks/creator/diagram/selectors';
import * as Feature from '@/ducks/feature';
import * as IntentSelectors from '@/ducks/intentV2/selectors';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import { createCurriedSelector } from '@/ducks/utils/selector';

import { creatorStateSelector } from './base';
import { linksByPortIDSelector } from './link';
import { nodeIDByPortIDSelector, portsByNodeIDSelector } from './port';

const _allNodeIDsSelector = createSelector([creatorStateSelector], ({ nodes }) => nodes.allKeys);
export const allNodeIDsSelector = Feature.createAtomicActionsPhase2Selector([CreatorV1Selectors.allNodeIDsSelector, _allNodeIDsSelector]);

const _markupIDsSelector = createSelector([creatorStateSelector], ({ markupIDs }) => markupIDs);
export const markupIDsSelector = Feature.createAtomicActionsPhase2Selector([CreatorV1Selectors.markupNodeIDsSelector, _markupIDsSelector]);

const _blockIDsSelector = createSelector([creatorStateSelector], ({ blockIDs }) => blockIDs);
export const blockIDsSelector = Feature.createAtomicActionsPhase2Selector([CreatorV1Selectors.rootNodeIDsSelector, _blockIDsSelector]);

const _stepIDsSelector = createSelector([creatorStateSelector], ({ nodes, parentNodeIDByStepID }) =>
  nodes.allKeys.filter((nodeID) => !!parentNodeIDByStepID[nodeID])
);
export const stepIDsSelector = Feature.createAtomicActionsPhase2Selector([CreatorV1Selectors.stepNodeIDsSelector, _stepIDsSelector]);

export const isBlockSelector = createSelector([blockIDsSelector, idParamSelector], (blockIDs, nodeID) => !!nodeID && blockIDs.includes(nodeID));

export const isStepSelector = createSelector([stepIDsSelector, idParamSelector], (stepIDs, nodeID) => !!nodeID && stepIDs.includes(nodeID));

const _startNodeIDSelector = createSelector([creatorStateSelector], ({ blockIDs, nodes }) => {
  const blocks = Normal.getMany(nodes, blockIDs);

  return blocks.find((block) => block.type === Realtime.BlockType.START)?.nodeID ?? null;
});
export const startNodeIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.startNodeIDSelector, _startNodeIDSelector],
  (startNodeV1, startNodeV2) => [startNodeV1 ?? null, startNodeV2]
);

const _nodeDataByIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ nodes }, nodeID) =>
  nodeID ? Normal.getOne(nodes, nodeID) ?? null : null
);
export const nodeDataByIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.dataByNodeIDSelector, _nodeDataByIDSelector, idParamSelector],
  (getNodeDataV1, nodeDataV2, nodeID) => [nodeID ? getNodeDataV1(nodeID) ?? null : null, nodeDataV2]
);

export const blockColorSelector = createSelector([nodeDataByIDSelector], (data) => {
  const blockData = data as Realtime.BlockNodeData<unknown>;

  return blockData && 'blockColor' in blockData ? blockData.blockColor : '';
});

export const getNodeDataByIDSelector = createCurriedSelector(nodeDataByIDSelector);

const _nodeDataByIDsSelector = createSelector([creatorStateSelector, idsParamSelector], ({ nodes }, nodeIDs) => Normal.getMany(nodes, nodeIDs));
export const nodeDataByIDsSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.dataByNodeIDsSelector, _nodeDataByIDsSelector, idsParamSelector],
  (getNodeDataV1, nodeDataV2, nodeIDs) => [getNodeDataV1(nodeIDs), nodeDataV2]
);

const _allNodeDataSelector = createSelector([creatorStateSelector], ({ nodes }) => Normal.denormalize(nodes));
export const allNodeDataSelector = Feature.createAtomicActionsPhase2Selector([CreatorV1Selectors.allNodeDataSelector, _allNodeDataSelector]);

const _nodeDataMapSelector = createSelector([creatorStateSelector], ({ nodes }) => nodes.byKey);
export const nodeDataMapSelector = Feature.createAtomicActionsPhase2Selector([
  createSelector([CreatorV1Selectors.creatorDiagramSelector], ({ data }) => data),
  _nodeDataMapSelector,
]);

export const allBlocksDataSelector = createSelector([blockIDsSelector, createCurriedSelector(nodeDataByIDsSelector)], (blockIDs, getDataByNodeIDs) =>
  _sortBy(getDataByNodeIDs({ ids: blockIDs }), ({ name }) => name.toLowerCase())
);

export const allBlocksMapDataSelector = createSelector([blockIDsSelector, getNodeDataByIDSelector], (blockIDs, getDataByNodeID) =>
  Object.fromEntries(blockIDs.map((id) => [id, getDataByNodeID({ id })] as const))
);

export const nodeTypeByIDSelector = createSelector([nodeDataByIDSelector], (data) => data?.type ?? null);

const _parentNodeIDByStepIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ parentNodeIDByStepID }, stepID) =>
  stepID ? parentNodeIDByStepID[stepID] ?? null : null
);
export const parentNodeIDByStepIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.nodeByIDSelector, _parentNodeIDByStepIDSelector, idParamSelector],
  (getNodeV1, parentNodeIDV2, stepID) => [stepID ? getNodeV1(stepID)?.parentNode ?? null : null, parentNodeIDV2]
);

const _nodeCoordsByIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ coordsByNodeID: positionByNodeID }, nodeID) =>
  nodeID ? positionByNodeID[nodeID] ?? null : null
);
export const nodeCoordsByIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.nodeByIDSelector, _nodeCoordsByIDSelector, idParamSelector],
  (getNodeV1, origin2, nodeID) => {
    const nodeV1 = nodeID ? getNodeV1(nodeID) ?? null : null;

    return [nodeV1 ? ([nodeV1.x, nodeV1.y] as Realtime.Point) : null, origin2];
  }
);

const _stepIDsByParentNodeIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ stepIDsByParentNodeID }, nodeID) =>
  nodeID ? stepIDsByParentNodeID[nodeID] ?? [] : []
);
export const stepIDsByParentNodeIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.combinedNodeIDsSelector, _stepIDsByParentNodeIDSelector, idParamSelector],
  (getStepsIDsV1, stepIDsV2, nodeID) => [nodeID ? getStepsIDsV1(nodeID) : [], stepIDsV2]
);

export const stepDataByParentNodeIDSelector = createSelector(
  [stepIDsByParentNodeIDSelector, createCurriedSelector(nodeDataByIDsSelector)],
  (stepIDs, getData) => getData({ ids: stepIDs })
);

const _linkedNodeIDsByNodeIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ linkIDsByNodeID, nodeIDsByLinkID }, nodeID) => {
  if (!nodeID) return [];

  const linkIDs = linkIDsByNodeID[nodeID] ?? [];
  const linkedNodeIDs = Utils.array.unique(linkIDs.flatMap((linkID) => nodeIDsByLinkID[linkID] ?? []));

  return Utils.array.withoutValue(linkedNodeIDs, nodeID);
});
export const linkedNodeIDsByNodeIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.linkedNodeIDsByNodeIDSelector, _linkedNodeIDsByNodeIDSelector, idParamSelector],
  (getNodeIDsV1, nodeIDsV2, nodeID) => [nodeID ? getNodeIDsV1(nodeID) : [], nodeIDsV2]
);

export const nodeByIDSelector = createSelector(
  [parentNodeIDByStepIDSelector, nodeCoordsByIDSelector, portsByNodeIDSelector, stepIDsByParentNodeIDSelector, nodeTypeByIDSelector, idParamSelector],
  // eslint-disable-next-line max-params
  (parentNode, origin, ports, stepIDs, type, nodeID): Realtime.Node | null =>
    nodeID && type
      ? {
          x: origin?.[0] ?? 0,
          y: origin?.[1] ?? 0,
          id: nodeID,
          type,
          ports,
          parentNode,
          combinedNodes: stepIDs,
        }
      : null
);

export const getNodeByIDSelector = createCurriedSelector(nodeByIDSelector);

export const nodeByPortIDSelector = createSelector([getNodeByIDSelector, nodeIDByPortIDSelector], (getNodeByID, nodeID) =>
  getNodeByID({ id: nodeID })
);

export const targetNodeByPortID = createSelector([linksByPortIDSelector, getNodeByIDSelector], (links, getNodeByID) =>
  getNodeByID({ id: links[0]?.target?.nodeID })
);

export const nodesByIDsSelector = createSelector([getNodeByIDSelector, idsParamSelector], (getNodeByID, nodeIDs) =>
  nodeIDs.reduce<Realtime.Node[]>((acc, nodeID) => {
    const node = getNodeByID({ id: nodeID });

    if (node) {
      acc.push(node);
    }

    return acc;
  }, [])
);

export const intentNodeDataLookupSelector = createSelector(
  [allNodeDataSelector, IntentSelectors.getIntentByIDSelector],
  (nodesData, getIntentByID) => {
    const result: { [intentID: string]: { data: Realtime.NodeData.Intent.PlatformData; intent: Realtime.Intent; nodeID: string } } = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const data of nodesData) {
      if (!Realtime.Utils.typeGuards.isIntentNodeData(data)) continue;

      if (!data.intent || !!result[data.intent]) continue;

      const intent = getIntentByID({ id: data.intent });

      if (!intent) continue;

      result[intent.id] = { data, intent, nodeID: data.nodeID };
    }

    return result;
  }
);
