import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Random> = {
  type: BlockType.RANDOM,

  icon: 'randomLoop',
  iconColor: '#616c60',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'Random',
      paths: 2,
      noDuplicates: false,
    },
  }),
};
