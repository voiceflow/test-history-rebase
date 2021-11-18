import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter, createOutPortsAdapter, nextAndFailOnlyOutPortsAdapter } from '../utils';

const cancelPaymentDataAdapter = createBlockAdapter<Node.CancelPayment.StepData, NodeData.CancelPayment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID: productID || '' })
);

export const cancelPaymentOutPortAdapter = createOutPortsAdapter<NodeData.CancelPaymentBuiltInPorts, NodeData.CancelPayment>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default cancelPaymentDataAdapter;
