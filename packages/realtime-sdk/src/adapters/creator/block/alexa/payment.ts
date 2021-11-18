import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter, createOutPortsAdapter, nextAndFailOnlyOutPortsAdapter } from '../utils';

const paymentAdapter = createBlockAdapter<Node.Payment.StepData, NodeData.Payment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID })
);

export const paymentOutPortAdapter = createOutPortsAdapter<NodeData.PaymentBuiltInPorts, NodeData.Payment>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export default paymentAdapter;
