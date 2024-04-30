import { faker } from '@faker-js/faker';
import { define } from 'cooky-cutter';

import type { BlockData as BlockDataType } from '@/adapters/creator/block/block';
import type { NodeData } from '@/models';

const getRandomBlockColor = () => faker.helpers.arrayElement(['#5b9fd7', '#56b365', '#80ff00', '#f263a7', '#dc8879']);

export const BlockData = define<BlockDataType>({
  name: () => faker.lorem.word(),
  color: getRandomBlockColor,
  blockColor: getRandomBlockColor,
});

export const CombinedNodeData = define<NodeData.Combined>({
  name: () => faker.lorem.word(),
  blockColor: getRandomBlockColor,
});

export const StartNodeData = define<NodeData.Start>({
  name: () => faker.lorem.word(),
  label: () => faker.lorem.word(),
  blockColor: getRandomBlockColor,
});
