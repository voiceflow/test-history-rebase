import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.RandomV2> = {
  type: BlockType.RANDOMV2,
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
      namedPaths: [{ label: 'Path 1' }, { label: 'Path 2' }],
      noDuplicates: false,
    },
  }),
};
