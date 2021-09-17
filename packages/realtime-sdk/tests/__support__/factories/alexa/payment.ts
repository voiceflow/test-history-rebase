import { Node } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype } from 'faker';

import { NodeData } from '@/models';

export const paymentStepDataFactory = define<Node.Payment.StepData>({
  productID: () => datatype.uuid(),
});

export const paymentNodeDataFactory = define<NodeData.Payment>({
  productID: () => datatype.uuid(),
});
