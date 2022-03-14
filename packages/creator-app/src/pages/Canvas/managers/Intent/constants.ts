import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

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
          builtIn: { [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Intent',
      intent: null,
      mappings: [],
      availability: BaseNode.Intent.IntentAvailability.GLOBAL,
    },
  }),
};
