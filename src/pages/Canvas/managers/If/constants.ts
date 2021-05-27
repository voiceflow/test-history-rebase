import { ExpressionType } from '@voiceflow/general-types';
import cuid from 'cuid';

import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { ExpressionData, NodeData } from '@/models';

import { NodeConfig } from '../types';

export const defaultExpressions = (conditionsBuilderEnabled = false) =>
  conditionsBuilderEnabled
    ? ({
        id: cuid.slug(),
        type: null,
        value: [],
      } as ExpressionData)
    : ({
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
      } as any);

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.If> = {
  type: BlockType.IF,

  icon: 'if',
  iconColor: '#f86683',

  mergeTerminator: true,

  factory: (_data, options) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'If',
      expressions: [defaultExpressions(options?.features?.[FeatureFlag.CONDITIONS_BUILDER]?.isEnabled)],
    },
  }),
};
