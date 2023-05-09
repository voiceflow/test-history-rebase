import { faker } from '@faker-js/faker';
import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

export const PaymentStepData = define<AlexaNode.Payment.StepData>({
  productID: () => faker.datatype.uuid(),
});

export const PaymentNodeData = define<NodeData.Payment>({
  productID: () => faker.datatype.uuid(),
});
