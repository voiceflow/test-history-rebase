import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { AIModel } from '@voiceflow/dtos';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

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
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH },
          },
        },
      },
    },
    data: {
      mode: BaseUtils.ai.PROMPT_MODE.PROMPT,
      name: 'Response AI',
      prompt: '',
      system: '',
      maxTokens: 128,
      model: AIModel.GPT_3_5_TURBO as unknown as BaseUtils.ai.GPT_MODEL,
      temperature: 0.7,
      notFoundPath: true,
      overrideParams: false,
    },
  }),
};
