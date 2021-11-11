import { define } from 'cooky-cutter';
import { lorem } from 'faker';

import { BlockData as BlockDataType } from '@/adapters/creator/block/block';
import { BlockVariant } from '@/constants';
import { NodeData } from '@/models';
import { getRandomEnumElement } from '@/tests/utils';

const getRandomBlockVariant = () => getRandomEnumElement(BlockVariant);

export const BlockData = define<BlockDataType>({
  name: () => lorem.word(),
  color: getRandomBlockVariant,
  blockColor: getRandomBlockVariant,
});

export const CombinedNodeData = define<NodeData.Combined>({
  name: () => lorem.word(),
  blockColor: getRandomBlockVariant,
});

export const StartNodeData = define<NodeData.Start>({
  name: () => lorem.word(),
  label: () => lorem.word(),
  blockColor: getRandomBlockVariant,
});
