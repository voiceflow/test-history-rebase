import { NodeType } from '../node-type.enum';
import type { BlockNode } from './block.node';

export const blockNode: BlockNode = {
  id: 'block-node-1',
  type: NodeType.BLOCK__V3,
  coords: [100, 200],

  data: {
    name: 'First Block',
    color: '#000',
    stepIDs: ['step-1', 'step-2', 'step-3'],
  },
};
