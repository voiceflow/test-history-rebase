import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { isChatbotPlatform } from '@/utils/typeGuards';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Capture> = {
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
      reprompt: null,
      examples: [],
      variable: null,
    },
  }),
};
