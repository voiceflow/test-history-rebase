import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts> = {
  type: BlockType.CAPTURE,
  icon: 'microphone',

  factory: (_, options) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: { [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Capture',
      slot: null,
      buttons: Realtime.Utils.typeGuards.isChatProjectType(options?.projectType) ? buttonsFactory() : null,
      noReply: null,
      examples: [],
      variable: null,
    },
  }),
};
