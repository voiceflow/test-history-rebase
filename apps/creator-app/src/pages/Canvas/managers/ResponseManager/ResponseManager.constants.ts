import { NodeSystemPortType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Response> = {
  type: BlockType.RESPONSE,
  icon: 'systemTalk',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          ...Realtime.Utils.port.createEmptyNodeOutPorts(),
          byKey: { [NodeSystemPortType.NEXT]: { label: NodeSystemPortType.NEXT } },
        },
      },
    },
    data: {
      responseID: null,
      name: '',
    },
  }),
};
