import { BlockVariant } from '@/constants/canvas';
import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

type BlockData = {
  name?: string;
  color?: string;
};

const blockDataAdapter = createBlockAdapter<BlockData, NodeData.Combined | NodeData.Start>(
  ({ name, color }) => ({
    name: name || '',
    blockColor: color || BlockVariant.STANDARD,
  }),
  ({ name, blockColor }) => ({ name, color: blockColor })
);

export default blockDataAdapter;
