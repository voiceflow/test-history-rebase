import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Directive> = {
  type: BlockType.DIRECTIVE,

  icon: 'directive',
  iconColor: '#5589eb',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Directive',
      directive: '',
    },
  }),
};
