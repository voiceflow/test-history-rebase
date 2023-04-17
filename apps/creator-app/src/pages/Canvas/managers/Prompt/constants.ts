import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts> = {
  type: BlockType.PROMPT,
  icon: 'prompt',

  mergeTerminator: true,

  factory: (_, { projectType } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: { [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH } },
        },
      },
    },
    data: {
      name: 'Prompt',
      noReply: null,
      buttons: Realtime.Utils.typeGuards.isChatProjectType(projectType) ? buttonsFactory() : null,
      noMatch: null,
    },
  }),
};
