import { ExpressionType } from '@voiceflow/general-types';
import cuid from 'cuid';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<NodeData.Set> = {
  type: BlockType.SET,

  icon: 'code',
  iconColor: '#5590b5',

  factory: (_data) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Set',
      sets: [
        {
          id: cuid.slug(),
          variable: null,
          expression: {
            id: cuid.slug(),
            type: ExpressionType.VALUE,
            value: '',
            depth: 0,
          },
        },
      ],
    },
  }),
};
