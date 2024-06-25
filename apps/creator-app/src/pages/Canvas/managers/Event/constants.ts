import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfigWithoutInPorts } from '../types';

export const NODE_CONFIG: NodeConfigWithoutInPorts<Realtime.NodeData.Event, Realtime.NodeData.EventBuiltInPorts> = {
  type: BlockType.EVENT,
  icon: 'eventV2',

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
      name: 'Event',
      requestName: '',
      mappings: [
        {
          var: '',
          path: '',
        },
      ],
    },
  }),
};
