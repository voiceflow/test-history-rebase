import { Utils } from '@voiceflow/common';
import { Intent } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import _sortBy from 'lodash/sortBy';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as Designer from '@/ducks/designer';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import { createCurriedSelector } from '@/ducks/utils/selector';

import { createCachedSelector } from '../utils/selector';
import { creatorStateSelector } from './base';
import { linksByPortIDSelector } from './link';
import { nodeIDByPortIDSelector } from './port';

export const allNodeIDsSelector = createSelector([creatorStateSelector], ({ nodes }) => nodes.allKeys);

export const markupIDsSelector = createSelector([creatorStateSelector], ({ markupIDs }) => markupIDs);

export const blockIDsSelector = createSelector([creatorStateSelector], ({ blockIDs }) => blockIDs);

export const stepIDsSelector = createSelector([creatorStateSelector], ({ nodes, parentNodeIDByStepID }) =>
  nodes.allKeys.filter((nodeID) => !!parentNodeIDByStepID[nodeID])
);

export const isBlockSelector = createSelector([blockIDsSelector, idParamSelector], (blockIDs, nodeID) => !!nodeID && blockIDs.includes(nodeID));

export const isStepSelector = createSelector([stepIDsSelector, idParamSelector], (stepIDs, nodeID) => !!nodeID && stepIDs.includes(nodeID));

export const startNodeIDSelector = createSelector([creatorStateSelector], ({ blockIDs, nodes }) => {
  const blocks = Normal.getMany(nodes, blockIDs);

  return blocks.find((block) => block.type === Realtime.BlockType.START)?.nodeID ?? null;
});

export const nodeDataByIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ nodes }, nodeID) =>
  nodeID ? Normal.getOne(nodes, nodeID) ?? null : null
);

export const blockColorSelector = createSelector([nodeDataByIDSelector], (data) => {
  const blockData = data as Realtime.BlockNodeData<unknown>;

  return blockData && 'blockColor' in blockData ? blockData.blockColor : '';
});

export const getNodeDataByIDSelector = createCurriedSelector(nodeDataByIDSelector);

export const nodeDataByIDsSelector = createSelector([creatorStateSelector, idsParamSelector], ({ nodes }, nodeIDs) => Normal.getMany(nodes, nodeIDs));

export const allNodeDataSelector = createSelector([creatorStateSelector], ({ nodes }) => Normal.denormalize(nodes));

export const nodeDataMapSelector = createSelector([creatorStateSelector], ({ nodes }) => nodes.byKey);

export const allBlocksDataSelector = createSelector([blockIDsSelector, createCurriedSelector(nodeDataByIDsSelector)], (blockIDs, getDataByNodeIDs) =>
  _sortBy(getDataByNodeIDs({ ids: blockIDs }), ({ name }) => name.toLowerCase())
);

export const allBlocksMapDataSelector = createSelector([blockIDsSelector, getNodeDataByIDSelector], (blockIDs, getDataByNodeID) =>
  Object.fromEntries(blockIDs.map((id) => [id, getDataByNodeID({ id })] as const))
);

export const nodeTypeByIDSelector = createSelector([nodeDataByIDSelector], (data) => data?.type ?? null);

export const parentNodeIDByStepIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ parentNodeIDByStepID }, stepID) =>
  stepID ? parentNodeIDByStepID[stepID] ?? null : null
);

export const nodeCoordsByIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ coordsByNodeID: positionByNodeID }, nodeID) =>
  nodeID ? positionByNodeID[nodeID] ?? null : null
);

export const stepIDsByParentNodeIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ stepIDsByParentNodeID }, nodeID) =>
  nodeID ? stepIDsByParentNodeID[nodeID] ?? [] : []
);

export const stepDataByParentNodeIDSelector = createSelector(
  [stepIDsByParentNodeIDSelector, createCurriedSelector(nodeDataByIDsSelector)],
  (stepIDs, getData) => getData({ ids: stepIDs })
);

export const linkedNodeIDsByNodeIDSelector = createSelector(
  [creatorStateSelector, idParamSelector],
  ({ linkIDsByNodeID, nodeIDsByLinkID }, nodeID) => {
    if (!nodeID) return [];

    const linkIDs = linkIDsByNodeID[nodeID] ?? [];
    const linkedNodeIDs = Utils.array.unique(linkIDs.flatMap((linkID) => nodeIDsByLinkID[linkID] ?? []));

    return Utils.array.withoutValue(linkedNodeIDs, nodeID);
  }
);

export const nodeCoordsByIDSelectorV2 = createSelector([creatorStateSelector], ({ coordsByNodeID }) => coordsByNodeID);
const portsByNodeIDSelectorV2 = createSelector([creatorStateSelector], ({ portsByNodeID }) => portsByNodeID);
const parentNodeIDByStepIDSelectorV2 = createSelector([creatorStateSelector], ({ parentNodeIDByStepID }) => parentNodeIDByStepID);
const stepIDsByParentNodeIDSelectorV2 = createSelector([creatorStateSelector], ({ stepIDsByParentNodeID }) => stepIDsByParentNodeID);

// for shallow comparison equality
const EMPTY_COMBINED_NODES_ARRAY: string[] = [];
export const nodeByIDSelector = createCachedSelector(
  [
    parentNodeIDByStepIDSelectorV2,
    nodeCoordsByIDSelectorV2,
    portsByNodeIDSelectorV2,
    stepIDsByParentNodeIDSelectorV2,
    nodeDataMapSelector,
    idParamSelector,
  ],
  // eslint-disable-next-line max-params
  (parentNodeIDByStepID, nodeCoordsByID, portsByNodeID, stepIDsByParentNodeID, dataMap, nodeID): Realtime.Node | null => {
    const type = dataMap[nodeID!]?.type;
    if (!nodeID || !type) return null;
    const coords = nodeCoordsByID[nodeID];

    return {
      x: coords?.[0] ?? 0,
      y: coords?.[1] ?? 0,
      id: nodeID,
      type,
      ports: portsByNodeID[nodeID] ?? Realtime.Utils.port.createEmptyNodePorts(),
      parentNode: parentNodeIDByStepID[nodeID] ?? null,
      combinedNodes: stepIDsByParentNodeID[nodeID] ?? EMPTY_COMBINED_NODES_ARRAY,
    };
  }
)((_, params) => idParamSelector(_, params) || '');

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
  [allNodeDataSelector, Designer.Intent.selectors.getOneByID],
  (nodesData, getCMSIntentByID) => {
    const result: Record<
      string,
      { data: Realtime.NodeData.Intent.PlatformData; intent: Platform.Base.Models.Intent.Model | Intent; nodeID: string }
    > = {};

    for (const data of nodesData) {
      if (!Realtime.Utils.typeGuards.isIntentNodeData(data)) continue;

      if (!data.intent || !!result[data.intent]) continue;

      const intent = getCMSIntentByID({ id: data.intent });

      if (!intent) continue;

      result[intent.id] = { data, intent, nodeID: data.nodeID };
    }

    return result;
  }
);
