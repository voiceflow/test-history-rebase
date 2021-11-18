import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = {
  type: BlockType.COMPONENT,
  icon: 'component',
  iconColor: '#5c6bc0',

  factory: ({ diagramID = null } = {}) => ({
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
      name: 'Component',
      inputs: [],
      outputs: [],
      diagramID,
    },
  }),
};
