import { faker } from '@faker-js/faker';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

import type { NodeData } from '@/models';

export const IntentStepData = define<BaseNode.Intent.StepData>({
  intent: () => faker.lorem.word(),
  mappings: () => [],
  availability: BaseNode.Intent.IntentAvailability.GLOBAL,
});

export const IntentNodeData = define<NodeData.Intent.PlatformData>({
  intent: faker.lorem.word(),
  mappings: [],
  availability: BaseNode.Intent.IntentAvailability.GLOBAL,
});
