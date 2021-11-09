import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Visual> = {
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
