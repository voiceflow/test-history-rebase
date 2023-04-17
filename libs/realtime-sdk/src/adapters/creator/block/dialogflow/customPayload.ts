import { NodeData } from '@realtime-sdk/models';
import { DFESNode } from '@voiceflow/google-dfes-types';

import { createBlockAdapter, createOutPortsAdapter, createOutPortsAdapterV2, nextOnlyOutPortsAdapter, nextOnlyOutPortsAdapterV2 } from '../utils';

const customPayload = createBlockAdapter<DFESNode.Payload.StepData, NodeData.CustomPayload>(
  ({ data: customPayload }) => ({ customPayload }),
  ({ customPayload }) => ({ data: customPayload })
);

export const customPayloadOutPortsAdapter = createOutPortsAdapter<NodeData.CustomPayloadBuiltInPorts, NodeData.CustomPayload>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const customPayloadOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CustomPayloadBuiltInPorts, NodeData.CustomPayload>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default customPayload;
