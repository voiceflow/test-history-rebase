import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { addManySteps, removeManyNodes, removeNodePortRemapLinks } from '../utils';
import { removeManyNodesReverter } from './removeManyNodes';
import {
  buildLinkRecreateActions,
  createActiveDiagramReducer,
  createManyNodesRemovalInvalidators,
  createNodeIndexInvalidators,
  createNodePortRemapsInvalidators,
  createNodeRemovalInvalidators,
  DIAGRAM_INVALIDATORS,
} from './utils';

const insertManyStepsReducer = createActiveDiagramReducer(
  Realtime.node.insertManySteps,
  (state, { parentNodeID, removeNodes, steps, index, nodePortRemaps = [] }) => {
    const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

    removeManyNodes(state, removeNodeIDs);

    addManySteps(
      state,
      (stepIDs) =>
        Utils.array.insertAll(
          stepIDs,
          index,
          steps.map(({ stepID }) => stepID)
        ),
      {
        parentNodeID,
        steps,
      }
    );

    removeNodePortRemapLinks(state, nodePortRemaps);
  }
);

export const insertManyStepsReverter = createReverter(
  Realtime.node.insertManySteps,

  (
    { workspaceID, projectID, versionID, domainID, diagramID, parentNodeID, steps, removeNodes, nodePortRemaps = [] },
    getState
  ) => {
    const ctx = { workspaceID, projectID, versionID, domainID, diagramID };
    const state = getState();

    const nodes = steps.map(({ stepID }) => ({ parentNodeID, stepID }));

    const removeActions =
      removeManyNodesReverter.revert(
        { workspaceID, projectID, versionID, domainID, diagramID, nodes: removeNodes },
        getState
      ) ?? [];

    return [
      Realtime.node.removeMany({ ...ctx, nodes }),
      ...nodePortRemaps.flatMap((portRemap) =>
        // only re-add links that have been removed
        portRemap.targetNodeID ? [] : buildLinkRecreateActions(state, ctx, portRemap)
      ),
      ...(Array.isArray(removeActions) ? removeActions : [removeActions]),
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.node.InsertManyStepsPayload>(
      (origin, nodeID) => origin.parentNodeID === nodeID
    ),
    ...createNodeIndexInvalidators<Realtime.node.InsertManyStepsPayload>(({ parentNodeID, index }) => ({
      parentNodeID,
      index,
    })),
    ...createNodePortRemapsInvalidators<Realtime.node.InsertManyStepsPayload>(
      ({ parentNodeID, nodePortRemaps = [] }) => ({
        parentNodeID,
        nodePortRemaps,
      })
    ),
    ...createManyNodesRemovalInvalidators<Realtime.node.InsertManyStepsPayload>((origin) => origin.removeNodes),
  ]
);

export default insertManyStepsReducer;
