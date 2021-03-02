import { APLType, VisualType } from '@voiceflow/general-types/build/nodes/visual';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Visual> = {
  type: BlockType.DISPLAY,

  icon: 'blocks',
  iconColor: '#3c6997',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Display',
      title: '',
      aplType: APLType.SPLASH,
      visualType: VisualType.APL,
      imageURL: '',
      document: '',
      datasource: '',
      jsonFileName: '',
    },
  }),
};
