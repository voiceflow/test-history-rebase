import { Node } from '@voiceflow/base-types';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import { distinctPlatformsData } from '@/utils/platform';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Intent> = {
  type: BlockType.INTENT,

  icon: 'user',
  iconColor: '#5589eb',

  mergeInitializer: true,

  factory: () => ({
    node: {
      ports: {
        out: [{}],
      },
    },
    data: {
      name: 'Intent',
      ...distinctPlatformsData({ intent: null, mappings: [], availability: Node.Intent.IntentAvailability.GLOBAL }),
    },
  }),
};
