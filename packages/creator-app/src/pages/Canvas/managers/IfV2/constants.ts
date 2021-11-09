import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.IfV2> = {
  type: BlockType.IFV2,

  icon: 'if',
  iconColor: '#f86683',

  mergeTerminator: true,

  factory: (_data) => ({
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
          id: Utils.id.cuid.slug(),
          type: null,
          value: [],
        },
      ],
      noMatch: {
        type: null,
        pathName: 'No Match',
      },
    },
  }),
};
