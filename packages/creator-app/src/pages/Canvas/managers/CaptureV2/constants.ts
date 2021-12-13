import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = {
  type: BlockType.CAPTUREV2,

  icon: 'capture',
  iconColor: '#58457a',

  factory: (_) => ({
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
      noReply: null,
      noMatch: null,
    },
  }),
};
