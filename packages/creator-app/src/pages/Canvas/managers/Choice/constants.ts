import { ElseType as InteractionElseType } from '@voiceflow/general-types/build/nodes/interaction';
import cuid from 'cuid';

import { BlockType, DialogType } from '@/constants';
import { NodeData } from '@/models';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { distinctPlatformsData } from '@/utils/platform';
import { isChatbotPlatform } from '@/utils/typeGuards';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Interaction> = {
  type: BlockType.CHOICE,

  icon: 'choice',
  iconColor: '#3a5999',

  mergeTerminator: true,

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}, {}],
      },
    },
    data: {
      name: 'Choice',
      choices: [distinctPlatformsData({ id: cuid.slug(), intent: null, mappings: [] })],
      reprompt: null,
      else: {
        type: InteractionElseType.REPROMPT,
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
    },
  }),
};
