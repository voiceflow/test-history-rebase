import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfigWithoutInPorts } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfigWithoutInPorts<Realtime.NodeData.Event, Realtime.NodeData.EventBuiltInPorts> = {
  type: BlockType.EVENT,
  icon: 'event',

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
