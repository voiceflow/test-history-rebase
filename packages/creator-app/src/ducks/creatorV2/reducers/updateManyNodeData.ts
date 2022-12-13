import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReverter } from '@/ducks/utils';

import { nodeDataByIDSelector } from '../selectors';
import { createActiveDiagramReducer, createDiagramInvalidator, DIAGRAM_INVALIDATORS } from './utils';

const updateManyNodeDataReducer = createActiveDiagramReducer(Realtime.node.updateDataMany, (state, payload) => {
  payload.nodes.forEach(({ nodeID, ...data }) => {
    if (!Normal.hasOne(state.nodes, nodeID)) return;

    Object.assign(state.nodes.byKey[nodeID], data);
  });
});

export default updateManyNodeDataReducer;

export const updateManyNodeDataReverter = createReverter(
  Realtime.node.updateDataMany,

  ({ workspaceID, projectID, versionID, domainID, diagramID, nodes, projectMeta }, getState) => {
    const prevNodes = nodes.flatMap((node) => {
      const data = nodeDataByIDSelector(getState(), { id: node.nodeID });

      return data ? [data] : [];
    });

    return prevNodes.length
      ? Realtime.node.updateDataMany({
          workspaceID,
          projectID,
          versionID,
          domainID,
          diagramID,
          nodes: prevNodes,
          projectMeta,
        })
      : [];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    createDiagramInvalidator(Realtime.node.updateDataMany, (origin, subject) =>
      origin.nodes.some(({ nodeID }) => subject.nodes.some((subjectNode) => nodeID === subjectNode.nodeID))
    ),
    createDiagramInvalidator(Realtime.node.removeMany, (origin, subject) =>
      subject.nodes.some((node) => origin.nodes.some(({ nodeID }) => nodeID === (node.stepID ?? node.parentNodeID)))
    ),
  ]
);
