import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Stream, Realtime.NodeData.StreamBuiltInPorts> = {
  type: BlockType.STREAM,

  icon: 'audioPlayer',
  iconColor: '#4f98c6',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: {
            [Models.PortType.NEXT]: { label: Models.PortType.NEXT },
            [Models.PortType.PAUSE]: { label: Models.PortType.PAUSE },
            [Models.PortType.PREVIOUS]: { label: Models.PortType.PREVIOUS },
          },
        },
      },
    },
    data: {
      name: 'Stream',
      title: '',
      description: '',
      iconImage: null,
      backgroundImage: null,
      customPause: false,
      loop: false,
      audio: '',
    },
  }),
};
