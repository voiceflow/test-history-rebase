import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfigWithoutPorts } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfigWithoutPorts<Realtime.NodeData.Deprecated> = {
  type: BlockType.DEPRECATED,

  icon: 'close',
  iconColor: '#adadad',

  factory: () => ({
    node: {
      ports: {},
    },
    data: {
      name: 'Deprecated Block',
    },
  }),
};
