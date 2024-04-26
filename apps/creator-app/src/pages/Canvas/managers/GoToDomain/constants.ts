import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfigWithoutOutPorts } from '../types';

// TODO: remove when FeatureFlag.CMS_WORKFLOWS is released
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
