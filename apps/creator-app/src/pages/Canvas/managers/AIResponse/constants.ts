import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { AIGPTModel } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.AIResponse, Realtime.NodeData.AIResponseBuiltInPorts> = {
  type: BlockType.AI_RESPONSE,
  icon: 'aiResponse',

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
      mode: BaseUtils.ai.PROMPT_MODE.PROMPT,
      name: 'Response AI',
      prompt: '',
      system: '',
      maxTokens: 128,
      model: AIGPTModel.GPT_3_5_turbo as unknown as BaseUtils.ai.GPT_MODEL,
      temperature: 0.7,
    },
  }),
};
