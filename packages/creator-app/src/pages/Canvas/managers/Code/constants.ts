import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = {
  type: BlockType.CODE,

  icon: 'power',
  iconColor: '#cdad32',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: {
            [Models.PortType.NEXT]: { label: Models.PortType.NEXT },
            [Models.PortType.FAIL]: { label: Models.PortType.FAIL },
          },
        },
      },
    },
    data: {
      name: 'Code',
      code: '',
    },
  }),
};
