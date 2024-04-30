import { faker } from '@faker-js/faker';
import type { AlexaNode } from '@voiceflow/alexa-types';
import { define } from 'cooky-cutter';

import type { NodeData } from '@/models';

export const StreamStepData = define<AlexaNode.Stream.StepData>({
  loop: () => faker.datatype.boolean(),
  audio: () => faker.internet.url(),
  title: () => faker.lorem.words(),
  iconImage: () => faker.image.animals(),
  description: () => faker.lorem.words(),
  customPause: () => faker.datatype.boolean(),
  backgroundImage: () => faker.image.animals(),
});

export const StreamNodeData = define<NodeData.Stream>({
  loop: () => faker.datatype.boolean(),
  audio: () => faker.internet.url(),
  title: () => faker.lorem.words(),
  iconImage: () => faker.image.animals(),
  description: () => faker.lorem.words(),
  customPause: () => faker.datatype.boolean(),
  backgroundImage: () => faker.image.animals(),
});
