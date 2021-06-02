import { ExpressionTypeV2 } from '@voiceflow/general-types';
import cuid from 'cuid';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

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
          id: cuid.slug(),
          variable: null,
          type: ExpressionTypeV2.VALUE,
          expression: '',
        },
      ],
    },
  }),
};
