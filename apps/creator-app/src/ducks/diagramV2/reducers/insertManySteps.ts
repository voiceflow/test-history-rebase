/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodeAndMenuItem, createReducer, nodeDataToSharedNode, removeSharedNodes } from './utils';

const insertManyStepsReducer = createReducer(
  Realtime.node.insertManySteps,
  (state, { steps, diagramID, removeNodes }) => {
    state.sharedNodes[diagramID] ??= {};

    const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

    removeSharedNodes(state, diagramID, removeNodeIDs);

    steps.forEach(({ stepID, data }) => {
      addSharedNodeAndMenuItem(state, diagramID, nodeDataToSharedNode({ ...data, nodeID: stepID }));
    });
  }
);

export default insertManyStepsReducer;
