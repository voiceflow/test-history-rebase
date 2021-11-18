import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  type: BlockType.DISPLAY,

  icon: 'blocks',
  iconColor: '#3c6997',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: { [Models.PortType.NEXT]: { label: Models.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Display',
      title: '',
      aplType: Node.Visual.APLType.SPLASH,
      visualType: Node.Visual.VisualType.APL,
      imageURL: '',
      document: '',
      datasource: '',
      jsonFileName: '',
    },
  }),
};
