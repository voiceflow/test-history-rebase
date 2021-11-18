import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter, createOutPortsAdapter, nextOnlyOutPortsAdapter } from '../utils';

const accountLinkingAdapter = createBlockAdapter<Node.AccountLinking.StepData, NodeData.AccountLinking>(
  () => ({}),
  () => ({})
);

export const accountLinkingOutPortAdapter = createOutPortsAdapter<NodeData.AccountLinkingBuiltInPorts, NodeData.AccountLinking>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default accountLinkingAdapter;
