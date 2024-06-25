import { BaseModels, BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfigWithoutInPorts } from '../types';

export const NODE_CONFIG: NodeConfigWithoutInPorts<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = {
  type: BlockType.INTENT,
  icon: 'intent',

  mergeInitializer: true,

  factory: () => ({
    node: {
      ports: {
        out: {
          byKey: {},
          dynamic: [],
          builtIn: { [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT } },
        },
      },
    },
    data: {
      name: '',
      intent: null,
      mappings: [],
      availability: BaseNode.Intent.IntentAvailability.GLOBAL,
    },
  }),
};
