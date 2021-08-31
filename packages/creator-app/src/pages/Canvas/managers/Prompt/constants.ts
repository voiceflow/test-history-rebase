import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { getPlatformNoMatchesFactory } from '@/utils/noMatches';
import { isChatbotPlatform } from '@/utils/typeGuards';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Prompt> = {
  type: BlockType.PROMPT,

  icon: 'prompt',
  iconColor: '#5C6BC0',

  mergeTerminator: true,

  factory: (_, { platform, defaultVoice } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Prompt',
      buttons: isChatbotPlatform(platform) ? buttonsFactory() : null,
      reprompt: null,
      noMatchReprompt: getPlatformNoMatchesFactory(platform)({ defaultVoice }),
    },
  }),
};
