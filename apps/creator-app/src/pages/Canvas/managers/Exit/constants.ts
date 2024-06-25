import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfigWithoutOutPorts } from '../types';

export const NODE_CONFIG: NodeConfigWithoutOutPorts<Realtime.NodeData.Exit> = {
  type: BlockType.EXIT,
  icon: 'editorExit',

  mergeTerminator: true,

  factory: ({ name = '' } = {}) => ({
    node: {
      ports: { in: [{}] },
    },

    data: { name },
  }),
};
