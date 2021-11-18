import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';

const cancelPaymentDataAdapter = createBlockAdapter<Node.CancelPayment.StepData, NodeData.CancelPayment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID: productID || '' })
);

export default cancelPaymentDataAdapter;
