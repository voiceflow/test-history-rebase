import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  type: BlockType.VISUAL,
  icon: 'display',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: { [Models.PortType.NEXT]: { label: Models.PortType.NEXT } },
        },
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
