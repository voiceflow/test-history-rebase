import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';

const paymentAdapter = createBlockAdapter<Node.Payment.StepData, NodeData.Payment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID })
);

export default paymentAdapter;
