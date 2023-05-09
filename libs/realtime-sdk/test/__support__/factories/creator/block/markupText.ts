import { faker } from '@faker-js/faker';
import { Markup } from '@realtime-sdk/models';
import { define } from 'cooky-cutter';

export const MarkupTextNodeData = define<Markup.NodeData.Text>({
  scale: () => faker.datatype.number(),
  rotate: () => faker.datatype.number(),
  content: () => [{ blocks: [], entityMap: {}, text: '' }],
  overrideWidth: () => faker.datatype.number(),
  backgroundColor: () => ({ r: faker.datatype.number(), g: faker.datatype.number(), b: faker.datatype.number(), a: faker.datatype.number() }),
});
