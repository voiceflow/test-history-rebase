import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextAndFailOnlyOutPortsAdapter,
  nextAndFailOnlyOutPortsAdapterV2,
} from '../utils';

const paymentAdapter = createBlockAdapter<AlexaNode.Payment.StepData, NodeData.Payment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID })
);

export const paymentOutPortAdapter = createOutPortsAdapter<NodeData.PaymentBuiltInPorts, NodeData.Payment>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const paymentOutPortAdapterV2 = createOutPortsAdapterV2<NodeData.PaymentBuiltInPorts, NodeData.Payment>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default paymentAdapter;
