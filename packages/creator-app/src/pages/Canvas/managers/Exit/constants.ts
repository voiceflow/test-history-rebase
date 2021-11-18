import { BlockType } from '@/constants';

import { NodeConfigWithoutOutPorts } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfigWithoutOutPorts<{}> = {
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
