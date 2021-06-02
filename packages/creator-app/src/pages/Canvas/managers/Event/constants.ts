import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Event> = {
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
