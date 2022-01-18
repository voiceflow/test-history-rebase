import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { distinctPlatformsData } from '@/utils/platform';

import { NodeConfigWithoutInPorts } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfigWithoutInPorts<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = {
  type: BlockType.INTENT,
  icon: 'user',

  mergeInitializer: true,

  factory: () => ({
    node: {
      ports: {
        out: {
          dynamic: [],
          builtIn: { [Models.PortType.NEXT]: { label: Models.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Intent',
      ...distinctPlatformsData({ intent: null, mappings: [], availability: Node.Intent.IntentAvailability.GLOBAL }),
    },
  }),
};
