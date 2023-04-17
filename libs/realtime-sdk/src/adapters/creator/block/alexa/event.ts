import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';

import { createBlockAdapter, createOutPortsAdapter, createOutPortsAdapterV2, nextOnlyOutPortsAdapter, nextOnlyOutPortsAdapterV2 } from '../utils';

const eventAdapter = createBlockAdapter<AlexaNode.Event.StepData, NodeData.Event>(
  ({ mappings, requestName }) => ({ mappings, requestName }),
  ({ mappings, requestName }) => ({ mappings, requestName })
);

export const eventOutPortAdapter = createOutPortsAdapter<NodeData.EventBuiltInPorts, NodeData.Event>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const eventOutPortAdapterV2 = createOutPortsAdapterV2<NodeData.EventBuiltInPorts, NodeData.Event>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default eventAdapter;
