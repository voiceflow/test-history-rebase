import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { linksByPortIDSelector, parentNodeIDByStepIDSelector, portByIDSelector, portsByNodeIDSelector } from '../selectors';
import { removeDynamicPort } from '../utils';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const removeDynamicPortReducer = createActiveDiagramReducer(Realtime.port.removeDynamic, (state, { nodeID, portID }) => {
  removeDynamicPort(state, nodeID, portID);
});

export default removeDynamicPortReducer;

export const removeDynamicPortReverter = createReverter(
  Realtime.port.removeDynamic,

  ({ workspaceID, projectID, versionID, domainID, diagramID, nodeID, portID }, getState) => {
    const ctx = { workspaceID, projectID, versionID, domainID, diagramID };
    const state = getState();
    const port = portByIDSelector(state, { id: portID });
    const links = linksByPortIDSelector(state, { id: portID });
    const ports = portsByNodeIDSelector(state, { id: nodeID });
    const index = ports.out.dynamic.indexOf(portID);

    return [
      Realtime.port.addDynamic({ ...ctx, nodeID, portID, index, label: port?.label }),
      ...links.map((link) => {
        const sourceParentNodeID = parentNodeIDByStepIDSelector(state, { id: link.source.nodeID });

        return Realtime.link.addDynamic({
          ...ctx,
          sourceParentNodeID,
          sourceNodeID: link.source.nodeID,
          sourcePortID: link.source.portID,
          targetNodeID: link.target.nodeID,
          targetPortID: link.target.portID,
          linkID: link.id,
          data: link.data,
        });
      }),
    ];
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.BasePortPayload>((origin, nodeID) => origin.nodeID === nodeID),
    createDiagramInvalidator(Realtime.port.addDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
    createDiagramInvalidator(Realtime.port.removeDynamic, (origin, subject) => origin.nodeID === subject.nodeID && origin.portID === subject.portID),
    createDiagramInvalidator(Realtime.port.reorderDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
    createDiagramInvalidator(
      Realtime.link.addDynamic,
      (origin, subject) => origin.nodeID === subject.sourceNodeID && origin.portID === subject.sourcePortID
    ),
    createDiagramInvalidator(Realtime.link.patchMany, (origin, subject) =>
      subject.patches.some((patch) => origin.nodeID === patch.nodeID && origin.portID === patch.portID)
    ),
  ]
);
