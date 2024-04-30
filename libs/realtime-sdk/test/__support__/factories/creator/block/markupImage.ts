import { faker } from '@faker-js/faker';
import { define } from 'cooky-cutter';

import type { Markup } from '@/models';

export const MarkupImageNodeData = define<Markup.NodeData.Image>({
  url: () => faker.internet.url(),
  width: () => faker.datatype.number(),
  height: () => faker.datatype.number(),
  rotate: () => faker.datatype.number(),
});
