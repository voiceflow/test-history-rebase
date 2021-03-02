import { ExpressionType } from '@voiceflow/general-types';
import cuid from 'cuid';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

export const HELP_LINK = 'https://docs.voiceflow.com/#/steps/set';

export const VIDEO_LINK = 'https://www.youtube.com/embed/6xgr-7GPZzU';

export const NODE_CONFIG: NodeConfig<NodeData.Set> = {
  type: BlockType.SET,

  icon: 'code',
  iconColor: '#5590b5',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Set',
      sets: [
        {
          id: cuid.slug(),
          variable: null,
          expression: {
            id: cuid.slug(),
            type: ExpressionType.VALUE,
            value: '',
            depth: 0,
          },
        },
      ],
    },
  }),
};
