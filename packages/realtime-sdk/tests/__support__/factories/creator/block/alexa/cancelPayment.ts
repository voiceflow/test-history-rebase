import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype } from 'faker';

import { NodeData } from '@/models';

export const CancelPaymentStepData = define<Node.CancelPayment.StepData>({
  productID: () => datatype.uuid(),
});

export const CancelPaymentNodeData = define<NodeData.CancelPayment>({
  productID: () => datatype.uuid(),
});
