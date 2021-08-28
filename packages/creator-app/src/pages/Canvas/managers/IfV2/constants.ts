import cuid from 'cuid';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.IfV2> = {
  type: BlockType.IFV2,

  icon: 'if',
  iconColor: '#f86683',

  mergeTerminator: true,

  factory: (_data) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'If',
      expressions: [
        {
          id: cuid.slug(),
          type: null,
          value: [],
        },
      ],
      noMatch: {
        type: null,
        pathName: 'No Match',
      },
    },
  }),
};
