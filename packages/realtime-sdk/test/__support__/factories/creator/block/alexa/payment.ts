import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype } from 'faker';

export const PaymentStepData = define<AlexaNode.Payment.StepData>({
  productID: () => datatype.uuid(),
});

export const PaymentNodeData = define<NodeData.Payment>({
  productID: () => datatype.uuid(),
});
