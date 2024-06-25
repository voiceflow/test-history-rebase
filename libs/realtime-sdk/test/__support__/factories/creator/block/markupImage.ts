import { faker } from '@faker-js/faker';
import type { Markup } from '@realtime-sdk/models';
import { define } from 'cooky-cutter';

export const MarkupImageNodeData = define<Markup.NodeData.Image>({
  url: () => faker.internet.url(),
  width: () => faker.datatype.number(),
  height: () => faker.datatype.number(),
  rotate: () => faker.datatype.number(),
});
