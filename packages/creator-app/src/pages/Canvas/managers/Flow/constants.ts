import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Flow, Realtime.NodeData.FlowBuiltInPorts> = {
  type: BlockType.FLOW,
  icon: 'flow',
  iconColor: '#3c6997',

  factory: () => ({
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
      name: 'Flow',
      diagramID: null,
      inputs: [],
      outputs: [],
    },
  }),
};
