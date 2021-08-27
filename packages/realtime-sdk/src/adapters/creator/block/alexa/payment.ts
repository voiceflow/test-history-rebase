import { Node } from '@voiceflow/alexa-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const paymentAdapter = createBlockAdapter<Node.Payment.StepData, NodeData.Payment>(
  ({ productID }) => ({ productID }),
  ({ productID }) => ({ productID })
);

export default paymentAdapter;
