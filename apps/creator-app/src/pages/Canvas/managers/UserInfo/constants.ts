import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.UserInfo, Realtime.NodeData.UserInfoBuiltInPorts> = {
  type: BlockType.USER_INFO,
  icon: 'barGraph',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.FAIL]: { label: BaseModels.PortType.FAIL },
          },
        },
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
