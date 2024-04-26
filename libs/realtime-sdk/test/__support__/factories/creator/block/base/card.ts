import { faker } from '@faker-js/faker';
import type { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

export const CardStepData = define<BaseNode.Card.StepData>({
  text: () => faker.lorem.text(),
  type: () => getRandomEnumElement(BaseNode.Card.CardType),
  title: () => faker.lorem.word(),
  image: () => [],
});

export const CardNodeData = define<NodeData.Card>({
  title: () => faker.lorem.word(),
  content: () => faker.lorem.text(),
  cardType: () => getRandomEnumElement(BaseNode.Card.CardType),
  largeImage: () => faker.internet.url(),
  smallImage: () => faker.internet.url(),
  hasSmallImage: () => faker.datatype.boolean(),
});
