import { BlockType } from '@/constants';

import { NodeConfigWithoutOutPorts } from '../types';

export const NODE_CONFIG: NodeConfigWithoutOutPorts<{}> = {
  type: BlockType.EXIT,
  icon: 'editorExit',

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
