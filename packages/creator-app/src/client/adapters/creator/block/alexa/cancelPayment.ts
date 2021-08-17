import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const cancelPaymentDataAdapter = createBlockAdapter<Node.CancelPayment.StepData, NodeData.CancelPayment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID: productID || '' })
);

export default cancelPaymentDataAdapter;
