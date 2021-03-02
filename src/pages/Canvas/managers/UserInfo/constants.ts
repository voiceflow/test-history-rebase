import cuid from 'cuid';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.UserInfo> = {
  type: BlockType.USER_INFO,

  icon: 'barGraph',
  iconColor: '#3C6997',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: 'fail' }],
      },
    },
    data: {
      name: 'User Info',
      permissions: [
        {
          id: cuid.slug(),
          selected: null,
          mapTo: null,
          product: null,
        },
      ],
    },
  }),
};
