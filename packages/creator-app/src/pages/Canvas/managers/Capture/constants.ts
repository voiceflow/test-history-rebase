import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Capture> = {
  type: BlockType.CAPTURE,

  icon: 'microphone',
  iconColor: '#58457a',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Capture',
      slot: null,
      buttons: null,
      examples: [],
      reprompt: null,
      variable: null,
    },
  }),
};
