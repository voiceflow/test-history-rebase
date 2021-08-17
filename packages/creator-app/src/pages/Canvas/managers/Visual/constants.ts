import { Node } from '@voiceflow/base-types';

import { BlockType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Visual> = {
  type: BlockType.VISUAL,

  icon: 'display',
  iconColor: '#3C6997',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Visuals',
      image: null,
      device: null,
      dimensions: null,
      visualType: Node.Visual.VisualType.IMAGE,
      canvasVisibility: Node.Visual.CanvasVisibility.FULL,
    },
  }),
};
