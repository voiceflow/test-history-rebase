import * as Realtime from '@voiceflow/realtime-sdk';

import { importSnapshot } from '@/ducks/creatorV2/reducers/importSnapshot';
import { DIAGRAM_INVALIDATORS } from '@/ducks/creatorV2/reducers/utils';
import { createReverter } from '@/ducks/utils';

import { builtInPortTypeSelector } from '../selectors';
import { createReducer } from './utils';

const importSnapshotReducer = createReducer(Realtime.creator.importSnapshot, (state, { diagramID, ...entities }) => {
  if (state.activeDiagramID !== diagramID) return;
  importSnapshot(state, entities);
});

export default importSnapshotReducer;

export const importSnapshotReverter = createReverter(
  Realtime.creator.importSnapshot,

  ({ workspaceID, projectID, versionID, domainID, diagramID, nodesWithData, links, ports }, getState) => {
    const state = getState();
    const ctx = { workspaceID, projectID, versionID, diagramID, domainID };
    const removedNodeIDs = new Set(nodesWithData.map(({ node }) => node.id));
    // no need to remove the port if the node is already being removed
    const portsToRemove = ports.filter((port) => !removedNodeIDs.has(port.nodeID));

    return [
      Realtime.link.removeMany({
        ...ctx,
        links: links.map((link) => {
          const type = builtInPortTypeSelector(state, { id: link.source.portID });

          return {
            nodeID: link.source.nodeID,
            portID: link.source.portID,
            linkID: link.id,
            type: type || undefined,
          };
        }),
      }),
      ...portsToRemove.map((port) => {
        const type = builtInPortTypeSelector(state, { id: port.id });

        return type
          ? Realtime.port.removeBuiltin({ ...ctx, nodeID: port.nodeID, portID: port.id, type, removeNodes: [] })
          : Realtime.port.removeDynamic({ ...ctx, nodeID: port.nodeID, portID: port.id, removeNodes: [] });
      }),
      Realtime.node.removeMany({
        ...ctx,
        nodes: nodesWithData.map(({ node }) =>
          node.parentNode ? { parentNodeID: node.parentNode, stepID: node.id } : { parentNodeID: node.id }
        ),
      }),
    ];
  },

  DIAGRAM_INVALIDATORS
);
