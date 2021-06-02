import cuid from 'cuid';

import { BlockType, DialogType } from '@/constants';
import { NodeData } from '@/models';

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
      },
    },
    data: {
      name: 'Prompt',
      noMatchReprompt: {
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
      chips: null,
      reprompt: null,
    },
  }),
};
