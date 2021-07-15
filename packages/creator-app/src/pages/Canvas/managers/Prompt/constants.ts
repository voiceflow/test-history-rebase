import { NoMatchType } from '@voiceflow/general-types';
import cuid from 'cuid';

import { BlockType, DialogType } from '@/constants';
import { NodeData } from '@/models';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { isChatbotPlatform } from '@/utils/typeGuards';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Prompt> = {
  type: BlockType.PROMPT,

  icon: 'prompt',
  iconColor: '#5C6BC0',

  mergeTerminator: true,

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Prompt',
      noMatchReprompt: {
        type: NoMatchType.REPROMPT,
        pathName: 'No Match',
        randomize: false,
        reprompts: [
          {
            id: cuid.slug(),
            type: DialogType.VOICE,
            voice: options?.defaultVoice ?? '',
            content: '',
          },
        ],
      },
      buttons: isChatbotPlatform(options?.platform) ? buttonsFactory() : null,
      reprompt: null,
    },
  }),
};
