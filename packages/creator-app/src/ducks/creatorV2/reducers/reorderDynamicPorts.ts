import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReverter } from '@/ducks/utils';

import { portsByNodeIDSelector } from '../selectors';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const reorderDynamicPortsReducer = createActiveDiagramReducer(Realtime.port.reorderDynamic, (state, { nodeID, portID, index }) => {
  if (!Normal.hasOne(state.ports, portID)) return;

  const ports = state.portsByNodeID[nodeID];

  if (!ports) return;

  const fromIndex = ports.out.dynamic.indexOf(portID);

  ports.out.dynamic = Utils.array.reorder(ports.out.dynamic, fromIndex, index);
});

export default reorderDynamicPortsReducer;

export const reorderDynamicPortsReverter = createReverter(
  Realtime.port.reorderDynamic,

  ({ workspaceID, projectID, versionID, domainID, diagramID, nodeID, portID }, getState) => {
    const prevIndex = portsByNodeIDSelector(getState(), { id: nodeID }).out.dynamic.indexOf(portID);

    return Realtime.port.reorderDynamic({ workspaceID, projectID, versionID, domainID, diagramID, nodeID, portID, index: prevIndex });
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.port.ReorderDynamicPayload>((origin, nodeID) => origin.nodeID === nodeID),
    createDiagramInvalidator(Realtime.port.addDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
    createDiagramInvalidator(Realtime.port.removeDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
    createDiagramInvalidator(Realtime.port.reorderDynamic, (origin, subject) => origin.nodeID === subject.nodeID),
  ]
);
