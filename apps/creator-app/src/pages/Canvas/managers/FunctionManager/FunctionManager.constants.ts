import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { DEFAULT_BY_KEY_PORT } from '../../constants';
import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Function> = {
  type: BlockType.FUNCTION,
  icon: 'systemCode',

  mergeTerminator: false,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          ...Realtime.Utils.port.createEmptyNodeOutPorts(),
          byKey: {
            [DEFAULT_BY_KEY_PORT]: {
              id: DEFAULT_BY_KEY_PORT,
              label: '',
            },
          },
        },
      },
    },
    data: {
      outputMapping: {},
      inputMapping: {},
      name: '',
      functionID: null,
    },
  }),
};
