import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Event> = {
  type: BlockType.EVENT,

  icon: 'event',
  iconColor: '#5589eb',

  mergeInitializer: true,

  factory: () => ({
    node: {
      ports: {
        out: [{}],
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
