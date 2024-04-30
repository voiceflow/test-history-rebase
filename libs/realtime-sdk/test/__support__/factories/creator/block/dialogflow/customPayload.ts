import { faker } from '@faker-js/faker';
import type { DFESNode } from '@voiceflow/google-dfes-types';
import { define } from 'cooky-cutter';

import type { NodeData } from '@/models';

export const CustomPayloadStep = define<DFESNode.Payload.StepData>({
  data: () => [],
});

export const CustomPayloadNodeData = define<NodeData.CustomPayload>({
  customPayload: () => ({ myNewAttribute: faker.lorem.word() }),
});
