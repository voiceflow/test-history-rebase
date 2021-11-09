import { Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.SetV2> = {
  type: BlockType.SETV2,

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
