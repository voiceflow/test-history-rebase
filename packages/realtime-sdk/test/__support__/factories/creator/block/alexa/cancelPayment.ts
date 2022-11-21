import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';
import { datatype } from 'faker';

export const CancelPaymentStepData = define<AlexaNode.CancelPayment.StepData>({
  productID: () => datatype.uuid(),
});

export const CancelPaymentNodeData = define<NodeData.CancelPayment>({
  productID: () => datatype.uuid(),
});
