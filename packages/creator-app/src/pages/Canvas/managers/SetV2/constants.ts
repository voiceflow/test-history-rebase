import { Models, Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = {
  type: BlockType.SETV2,
  icon: 'code',

  factory: (_data) => ({
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
      name: 'Set',
      title: '',
      sets: [
        {
          id: Utils.id.cuid.slug(),
          variable: null,
          type: Node.Utils.ExpressionTypeV2.VALUE,
          expression: '',
        },
      ],
    },
  }),
};
