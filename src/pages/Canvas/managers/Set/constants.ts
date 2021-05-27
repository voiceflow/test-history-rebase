import { ExpressionType, ExpressionTypeV2 } from '@voiceflow/general-types';
import cuid from 'cuid';

import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import { Expression, NodeData } from '@/models';

import { NodeConfig } from '../types';

export const defaultExpression = (conditionsBuilderEnabled = false) =>
  conditionsBuilderEnabled
    ? ''
    : {
        id: cuid.slug(),
        type: ExpressionType.VALUE,
        value: '',
        depth: 0,
      };

export const NODE_CONFIG: NodeConfig<NodeData.Set> = {
  type: BlockType.SET,

  icon: 'code',
  iconColor: '#5590b5',

  factory: (_data, options) => ({
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
          // Temporary force typing, need to merge the new expression adapter, then we can remove this
          expression: defaultExpression(options?.features?.[FeatureFlag.CONDITIONS_BUILDER]?.isEnabled) as Expression,
        },
      ],
    },
  }),
};
