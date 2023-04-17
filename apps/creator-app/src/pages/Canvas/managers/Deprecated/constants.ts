import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfigWithoutPorts } from '../types';

export const NODE_CONFIG: NodeConfigWithoutPorts<Realtime.NodeData.Deprecated> = {
  type: BlockType.DEPRECATED,
  icon: 'close',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {},
    },
    data: {
      name: 'Deprecated Block',
    },
  }),
};
