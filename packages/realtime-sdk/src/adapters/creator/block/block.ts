import { BlockVariant } from '@realtime-sdk/constants';
import { NodeData } from '@realtime-sdk/models';

import { createBlockAdapter } from './utils';

export interface BlockData {
  name?: string;
  color?: BlockVariant;
  blockColor?: BlockVariant;
}

const blockDataAdapter = createBlockAdapter<BlockData, NodeData.Combined | NodeData.Start>(
  ({ name, color, blockColor }) => ({
    name: name || '',
    blockColor: color || blockColor || BlockVariant.STANDARD,
  }),
  ({ name, blockColor }) => ({ name, color: blockColor })
);

export default blockDataAdapter;
