import { Models } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.UserInfo> = {
  type: BlockType.USER_INFO,

  icon: 'barGraph',
  iconColor: '#3C6997',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, { label: Models.PortType.FAIL }],
      },
    },
    data: {
      name: 'User Info',
      permissions: [
        {
          id: Utils.id.cuid.slug(),
          selected: null,
          mapTo: null,
          product: null,
        },
      ],
    },
  }),
};
