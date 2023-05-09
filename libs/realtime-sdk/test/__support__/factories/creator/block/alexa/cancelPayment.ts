import { faker } from '@faker-js/faker';
import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

export const CancelPaymentStepData = define<AlexaNode.CancelPayment.StepData>({
  productID: () => faker.datatype.uuid(),
});

export const CancelPaymentNodeData = define<NodeData.CancelPayment>({
  productID: () => faker.datatype.uuid(),
});
