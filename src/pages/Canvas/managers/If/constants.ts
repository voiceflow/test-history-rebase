import { ExpressionType } from '@voiceflow/general-types';
import cuid from 'cuid';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.If> = {
  type: BlockType.IF,

  icon: 'if',
  iconColor: '#f86683',

  mergeTerminator: true,

  factory: () => ({
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
          type: ExpressionType.EQUALS,
          depth: 0,
          value: [
            {
              id: cuid.slug(),
              type: ExpressionType.VARIABLE,
              value: '',
              depth: 1,
            },
            {
              id: cuid.slug(),
              type: ExpressionType.VALUE,
              value: '',
              depth: 1,
            },
          ],
        },
      ],
    },
  }),
};
