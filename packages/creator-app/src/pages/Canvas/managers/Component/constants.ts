import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Component> = {
  type: BlockType.COMPONENT,
  icon: 'component',
  iconColor: '#5c6bc0',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Component',
      diagramID: null,
      inputs: [],
      outputs: [],
    },
  }),
};
