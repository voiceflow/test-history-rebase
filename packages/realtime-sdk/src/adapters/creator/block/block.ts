import { BLOCK_STANDARD_COLOR } from '@realtime-sdk/constants';
import { NodeData } from '@realtime-sdk/models';

import { createBlockAdapter } from './utils';

export interface BlockData {
  name?: string;
  blockColor?: string;
  color?: string;
}

const blockDataAdapter = createBlockAdapter<BlockData, NodeData.Combined | NodeData.Start>(
  ({ name, color, blockColor }) => ({
    name: name || '',
    blockColor: color || blockColor || BLOCK_STANDARD_COLOR,
  }),
  ({ name, blockColor }) => ({ name, color: blockColor })
);

export default blockDataAdapter;
