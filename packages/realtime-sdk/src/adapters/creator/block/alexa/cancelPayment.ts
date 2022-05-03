import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextAndFailOnlyOutPortsAdapter,
  nextAndFailOnlyOutPortsAdapterV2,
} from '../utils';

const cancelPaymentDataAdapter = createBlockAdapter<AlexaNode.CancelPayment.StepData, NodeData.CancelPayment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID: productID || '' })
);

export const cancelPaymentOutPortAdapter = createOutPortsAdapter<NodeData.CancelPaymentBuiltInPorts, NodeData.CancelPayment>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const cancelPaymentOutPortAdapterV2 = createOutPortsAdapterV2<NodeData.CancelPaymentBuiltInPorts, NodeData.CancelPayment>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default cancelPaymentDataAdapter;
