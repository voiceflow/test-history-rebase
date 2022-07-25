import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Random> = {
  type: BlockType.RANDOM,
  icon: 'randomV2',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [{}, {}],
          builtIn: {},
        },
      },
    },
    data: {
      name: 'Random',
      paths: 2,
      noDuplicates: false,
    },
  }),
};
