import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';
import { isChatbotPlatform } from '@/utils/typeGuards';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts> = {
  type: BlockType.PROMPT,

  icon: 'prompt',
  iconColor: '#5C6BC0',

  mergeTerminator: true,

  factory: (_, { platform, defaultVoice } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: { [Models.PortType.NO_MATCH]: { label: Models.PortType.NO_MATCH } },
        },
      },
    },
    data: {
      name: 'Prompt',
      reprompt: null,
      buttons: isChatbotPlatform(platform) ? buttonsFactory() : null,
      noMatchReprompt: getPlatformNoMatchFactory(platform)({ defaultVoice }),
    },
  }),
};
