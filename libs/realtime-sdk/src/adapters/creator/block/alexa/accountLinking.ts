import type { NodeData } from '@realtime-sdk/models';
import type { AlexaNode } from '@voiceflow/alexa-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextOnlyOutPortsAdapter,
  nextOnlyOutPortsAdapterV2,
} from '../utils';

const accountLinkingAdapter = createBlockAdapter<AlexaNode.AccountLinking.StepData, NodeData.AccountLinking>(
  () => ({}),
  () => ({})
);

export const accountLinkingOutPortAdapter = createOutPortsAdapter<
  NodeData.AccountLinkingBuiltInPorts,
  NodeData.AccountLinking
>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const accountLinkingOutPortAdapterV2 = createOutPortsAdapterV2<
  NodeData.AccountLinkingBuiltInPorts,
  NodeData.AccountLinking
>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default accountLinkingAdapter;
