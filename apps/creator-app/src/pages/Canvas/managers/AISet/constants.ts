import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const DEFAULT_LENGTH = 128;

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.AISet, Realtime.NodeData.AISetBuiltInPorts> = {
  type: BlockType.AI_SET,
  icon: 'aiSet',

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
      name: 'AI Set',
      label: '',
      sets: [
        {
          mode: BaseUtils.ai.PROMPT_MODE.PROMPT,
          prompt: '',
          variable: null,
        },
      ],
      system: '',
      maxTokens: 128,
      model: BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo,
      temperature: 0.7,
    },
  }),
};
