import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Random> = {
  type: BlockType.RANDOM,
  icon: 'randomLoop',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
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
