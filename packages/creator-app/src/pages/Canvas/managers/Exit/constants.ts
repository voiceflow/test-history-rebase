import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<{}> = {
  type: BlockType.EXIT,

  icon: 'exit',
  iconColor: '#d94c4c',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
      },
    },
    data: {
      name: 'Exit',
    },
  }),
};
