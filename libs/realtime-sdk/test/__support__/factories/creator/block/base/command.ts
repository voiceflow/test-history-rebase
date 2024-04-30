import { faker } from '@faker-js/faker';
import type { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

import type { NodeData } from '@/models';

export const CommandStepData = define<BaseNode.Command.StepData>({
  name: () => faker.lorem.word(),
  intent: () => faker.lorem.word(),
  mappings: () => [{ slot: faker.lorem.word(), variable: faker.lorem.word() }],
  diagramID: () => faker.datatype.uuid(),
});

export const CommandPlatformData = define<NodeData.Command.PlatformData>({
  intent: () => faker.lorem.word(),
  mappings: () => [{ slot: faker.lorem.word(), variable: faker.lorem.word() }],
  diagramID: () => faker.datatype.uuid(),
});

export const CommandNodeData = define<NodeData.Command>({
  ...CommandPlatformData({ intent: null, diagramID: null, mappings: [] }),
  name: () => faker.lorem.word(),
});
