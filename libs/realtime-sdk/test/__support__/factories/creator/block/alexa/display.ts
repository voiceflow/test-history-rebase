import { faker } from '@faker-js/faker';
import { getRandomEnumElement } from '@test/utils';
import type { AlexaNode } from '@voiceflow/alexa-types';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

export const DisplayStepData = define<AlexaNode.Display.StepData>({
  type: () => getRandomEnumElement(BaseNode.Visual.APLType),
  title: () => faker.lorem.words(),
  document: () => faker.internet.url(),
  imageURL: () => faker.internet.url(),
  datasource: () => faker.lorem.word(),
  aplCommands: () => faker.lorem.word(),
  jsonFileName: () => faker.lorem.word(),
});

export const DisplayNodeData = define<BaseNode.Visual.APLStepData>({
  title: () => faker.lorem.words(),
  aplType: () => getRandomEnumElement(BaseNode.Visual.APLType),
  document: () => faker.internet.url(),
  imageURL: () => faker.internet.url(),
  datasource: () => faker.lorem.word(),
  visualType: (): BaseNode.Visual.VisualType.APL => BaseNode.Visual.VisualType.APL,
  aplCommands: () => faker.lorem.word(),
  jsonFileName: () => faker.lorem.word(),
});
