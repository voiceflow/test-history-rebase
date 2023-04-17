import { NodeData } from '@realtime-sdk/models';

import { createBlockAdapter } from './utils';

export interface BlockData {
  name?: string;
  color?: string;
  blockColor?: string;
}

const blockDataAdapter = createBlockAdapter<BlockData, NodeData.Combined | NodeData.Start>(
  ({ name, color, blockColor }) => ({
    name: name || '',
    blockColor: color || blockColor || '',
  }),
  ({ name, blockColor }) => ({ name, color: blockColor })
);

export default blockDataAdapter;
