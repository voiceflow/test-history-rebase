import { TriggerNodeItemType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as DesignerIntentSelectors from '@/ducks/designer/intent/selectors';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import { createCurriedSelector } from '@/ducks/utils/selector';

import { createCachedSelector } from '../utils/selector';
import { creatorStateSelector } from './base';
import { linksByPortIDSelector } from './link';
import { nodeIDByPortIDSelector, portsByNodeIDSelector } from './port';

export const allNodeIDsSelector = createSelector([creatorStateSelector], ({ nodes }) => nodes.allKeys);

export const markupIDsSelector = createSelector([creatorStateSelector], ({ markupIDs }) => markupIDs);

export const blockIDsSelector = createSelector([creatorStateSelector], ({ blockIDs }) => blockIDs);

export const stepIDsSelector = createSelector([creatorStateSelector], ({ nodes, parentNodeIDByStepID }) =>
  nodes.allKeys.filter((nodeID) => !!parentNodeIDByStepID[nodeID])
);

export const isBlockSelector = createSelector(
  [blockIDsSelector, idParamSelector],
  (blockIDs, nodeID) => !!nodeID && blockIDs.includes(nodeID)
);

export const isStepSelector = createSelector(
  [stepIDsSelector, idParamSelector],
  (stepIDs, nodeID) => !!nodeID && stepIDs.includes(nodeID)
);

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

export const nodeDataByIDsSelector = createSelector([creatorStateSelector, idsParamSelector], ({ nodes }, nodeIDs) =>
  Normal.getMany(nodes, nodeIDs)
);

export const allNodeDataSelector = createSelector([creatorStateSelector], ({ nodes }) => Normal.denormalize(nodes));

export const nodeDataMapSelector = createSelector([creatorStateSelector], ({ nodes }) => nodes.byKey);

export const nodeTypeByIDSelector = createSelector([nodeDataByIDSelector], (data) => data?.type ?? null);

export const parentNodeIDByStepIDSelector = createSelector(
  [creatorStateSelector, idParamSelector],
  ({ parentNodeIDByStepID }, stepID) => (stepID ? parentNodeIDByStepID[stepID] ?? null : null)
);

export const nodeCoordsMapSelector = createSelector([creatorStateSelector], ({ coordsByNodeID }) => coordsByNodeID);

export const nodeCoordsByIDSelector = createSelector(
  [nodeCoordsMapSelector, idParamSelector],
  (coordsByNodeID, nodeID) => (nodeID ? coordsByNodeID[nodeID] ?? null : null)
);

// for shallow comparison equality
const EMPTY_STEP_IDS: string[] = [];

export const stepIDsByParentNodeIDSelector = createSelector(
  [creatorStateSelector, idParamSelector],
  ({ stepIDsByParentNodeID }, nodeID) => (nodeID ? stepIDsByParentNodeID[nodeID] ?? EMPTY_STEP_IDS : EMPTY_STEP_IDS)
);

export const stepDataByParentNodeIDSelector = createSelector(
  [stepIDsByParentNodeIDSelector, createCurriedSelector(nodeDataByIDsSelector)],
  (stepIDs, getData) => getData({ ids: stepIDs })
);

export const nodeByIDSelector = createCachedSelector(
  [
    parentNodeIDByStepIDSelector,
    nodeCoordsByIDSelector,
    portsByNodeIDSelector,
    stepIDsByParentNodeIDSelector,
    nodeTypeByIDSelector,
    idParamSelector,
  ],
  // eslint-disable-next-line max-params
  (parentNode, coords, ports, combinedNodes, type, nodeID): Realtime.Node | null => {
    if (!nodeID || !type) return null;

    return {
      x: coords?.[0] ?? 0,
      y: coords?.[1] ?? 0,
      id: nodeID,
      type,
      ports,
      parentNode,
      combinedNodes,
    };
  }
)((_, params) => idParamSelector(_, params) || '');

export const getNodeByIDSelector = createCurriedSelector(nodeByIDSelector);

export const nodeByPortIDSelector = createSelector(
  [getNodeByIDSelector, nodeIDByPortIDSelector],
  (getNodeByID, nodeID) => getNodeByID({ id: nodeID })
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

export const intentIDNodeIDMapSelector = createSelector(
  [allNodeDataSelector, DesignerIntentSelectors.getOneByID],
  (nodesData, getCMSIntentByID) => {
    const result: Record<string, string> = {};

    for (const data of nodesData) {
      if (Realtime.Utils.typeGuards.isIntentNodeData(data)) {
        if (!data.intent || !!result[data.intent]) continue;

        const intent = getCMSIntentByID({ id: data.intent });

        if (!intent) continue;

        result[intent.id] = data.nodeID;
      } else if (Realtime.Utils.typeGuards.isTriggerNodeData(data)) {
        data.items.forEach((item) => {
          if (item.type !== TriggerNodeItemType.INTENT || !item.resourceID) return;

          const intent = getCMSIntentByID({ id: item.resourceID });

          if (!intent) return;

          result[intent.id] = data.nodeID;
        });
      } else if (Realtime.Utils.typeGuards.isStartNodeData(data)) {
        data.triggers.forEach((item) => {
          if (item.type !== TriggerNodeItemType.INTENT || !item.resourceID) return;

          const intent = getCMSIntentByID({ id: item.resourceID });

          if (!intent) return;

          result[intent.id] = data.nodeID;
        });
      }
    }

    return result;
  }
);
