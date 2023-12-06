import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Function> = {
  type: BlockType.FUNCTION,
  icon: 'systemCode',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          ...Realtime.Utils.port.createEmptyNodeOutPorts(),
        },
      },
    },
    data: {
      functionID: null,
      inputMapping: {},
      outputMapping: {},
      name: '',
    },
  }),
};
