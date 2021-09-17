import { define } from 'cooky-cutter';
import { lorem, random } from 'faker';

import { BlockData } from '@/adapters/creator/block/block';
import { BlockVariant } from '@/constants';
import { NodeData } from '@/models';

const getRandomBlockVariant = () => random.arrayElement(Object.values(BlockVariant));

export const blockDataFactory = define<BlockData>({
  blockColor: getRandomBlockVariant,
  color: getRandomBlockVariant,
  name: () => lorem.word(),
});

export const combinedNodeDataFactory = define<NodeData.Combined>({
  blockColor: getRandomBlockVariant,
  name: () => lorem.word(),
});

export const startNodeDataFactory = define<NodeData.Start>({
  blockColor: getRandomBlockVariant,
  name: () => lorem.word(),
});
