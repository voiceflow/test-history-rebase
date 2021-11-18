import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter, createOutPortsAdapter, nextOnlyOutPortsAdapter } from '../utils';

const eventAdapter = createBlockAdapter<Node.Event.StepData, NodeData.Event>(
  ({ mappings, requestName }) => ({ mappings, requestName }),
  ({ mappings, requestName }) => ({ mappings, requestName })
);

export const eventOutPortAdapter = createOutPortsAdapter<NodeData.EventBuiltInPorts, NodeData.Event>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default eventAdapter;
