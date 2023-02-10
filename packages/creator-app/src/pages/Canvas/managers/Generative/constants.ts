import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const DEFAULT_LENGTH = 128;

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Generative, Realtime.NodeData.GenerativeBuiltInPorts> = {
  type: BlockType.GENERATIVE,
  icon: 'ai',

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
      name: 'Generate',
      length: DEFAULT_LENGTH,
      prompt: '',
    },
  }),
};
