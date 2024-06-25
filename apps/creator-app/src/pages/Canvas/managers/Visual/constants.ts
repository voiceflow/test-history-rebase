import { BaseModels, BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  type: BlockType.VISUAL,
  icon: 'systemImage',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: { [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Visuals',
      image: null,
      device: null,
      dimensions: null,
      visualType: BaseNode.Visual.VisualType.IMAGE,
      canvasVisibility: BaseNode.Visual.CanvasVisibility.FULL,
    },
  }),
};
