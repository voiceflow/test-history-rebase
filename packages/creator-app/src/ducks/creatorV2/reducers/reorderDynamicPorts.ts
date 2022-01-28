import * as Realtime from '@realtime-sdk';
import { Utils } from '@voiceflow/common';
import * as Normal from 'normal-store';

import { createActiveDiagramReducer } from './utils';

const reorderDynamicPortsReducer = createActiveDiagramReducer(Realtime.node.reorderDynamicPorts, (state, { nodeID, portID, index }) => {
  if (!Normal.hasOne(state.ports, portID)) return;

  const ports = state.portsByNodeID[nodeID];

  if (!ports) return;

  const currentIndex = ports.out.dynamic.indexOf(portID);

  if (currentIndex === -1) return;

  ports.out.dynamic = Utils.array.reorder(ports.out.dynamic, currentIndex, index);
});

export default reorderDynamicPortsReducer;
