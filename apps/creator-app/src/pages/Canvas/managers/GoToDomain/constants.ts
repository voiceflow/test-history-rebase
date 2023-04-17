import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfigWithoutOutPorts } from '../types';

export const NODE_CONFIG: NodeConfigWithoutOutPorts<Realtime.NodeData.GoToDomain> = {
  type: BlockType.GO_TO_DOMAIN,
  icon: 'goToDomain',

  mergeTerminator: true,

  factory: ({ name = '' } = {}) => ({
    node: {
      ports: { in: [{}] },
    },

    data: { name },
  }),
};
