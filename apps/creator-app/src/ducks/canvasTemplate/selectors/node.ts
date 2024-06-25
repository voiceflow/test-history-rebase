import type * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import { createCurriedSelector } from '@/ducks/utils/selector';

import { creatorStateSelector } from './base';
import { portsByNodeIDSelector } from './port';

export const nodeDataByIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ nodes }, nodeID) =>
  nodeID ? Normal.getOne(nodes, nodeID) ?? null : null
);

export const nodeDataMapSelector = createSelector([creatorStateSelector], ({ nodes }) => nodes.byKey);

const nodeTypeByIDSelector = createSelector([nodeDataByIDSelector], (data) => data?.type ?? null);

const parentNodeIDByStepIDSelector = createSelector(
  [creatorStateSelector, idParamSelector],
  ({ parentNodeIDByStepID }, stepID) => (stepID ? parentNodeIDByStepID[stepID] ?? null : null)
);

const nodeCoordsByIDSelector = createSelector(
  [creatorStateSelector, idParamSelector],
  ({ coordsByNodeID: positionByNodeID }, nodeID) => (nodeID ? positionByNodeID[nodeID] ?? null : null)
);

const stepIDsByParentNodeIDSelector = createSelector(
  [creatorStateSelector, idParamSelector],
  ({ stepIDsByParentNodeID }, nodeID) => (nodeID ? stepIDsByParentNodeID[nodeID] ?? [] : [])
);

export const nodeByIDSelector = createSelector(
  [
    parentNodeIDByStepIDSelector,
    nodeCoordsByIDSelector,
    portsByNodeIDSelector,
    stepIDsByParentNodeIDSelector,
    nodeTypeByIDSelector,
    idParamSelector,
  ],
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

const getNodeByIDSelector = createCurriedSelector(nodeByIDSelector);

export const nodesByIDsSelector = createSelector([getNodeByIDSelector, idsParamSelector], (getNodeByID, nodeIDs) =>
  nodeIDs.reduce<Realtime.Node[]>((acc, nodeID) => {
    const node = getNodeByID({ id: nodeID });

    if (node) {
      acc.push(node);
    }

    return acc;
  }, [])
);

const getNodeDataByIDSelector = createCurriedSelector(nodeDataByIDSelector);

export const nodesDataByIDsSelector = createSelector(
  [getNodeDataByIDSelector, idsParamSelector],
  (getNodeDataByID, nodeIDs) =>
    nodeIDs.reduce<Realtime.NodeData<unknown>[]>((acc, nodeID) => {
      const node = getNodeDataByID({ id: nodeID });

      if (node) {
        acc.push(node);
      }

      return acc;
    }, [])
);

export const blockColorSelector = createSelector([nodeDataByIDSelector], (data) => {
  const blockData = data as Realtime.BlockNodeData<unknown>;
  return blockData && 'blockColor' in blockData ? blockData.blockColor : '';
});
