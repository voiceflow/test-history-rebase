import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { isChatbotPlatform } from '@/utils/typeGuards';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Capture> = {
  type: BlockType.CAPTURE,

  icon: 'microphone',
  iconColor: '#58457a',

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Capture',
      slot: null,
      buttons: isChatbotPlatform(options?.platform) ? buttonsFactory() : null,
      examples: [],
      reprompt: null,
      variable: null,
    },
  }),
};
