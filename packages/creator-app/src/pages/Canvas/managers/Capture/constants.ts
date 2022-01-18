import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';
import { isChatbotPlatform } from '@/utils/typeGuards';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts> = {
  type: BlockType.CAPTURE,
  icon: 'microphone',

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: { [Models.PortType.NEXT]: { label: Models.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Capture',
      slot: null,
      buttons: isChatbotPlatform(options?.platform) ? buttonsFactory() : null,
      noReply: null,
      examples: [],
      variable: null,
    },
  }),
};
