import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import { PortType } from '@/constants/canvas';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Stream> = {
  type: BlockType.STREAM,

  icon: 'audioPlayer',
  iconColor: '#4f98c6',

  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [
          { label: PortType.NEXT, target: null },
          { label: PortType.PREVIOUS, target: null },
          { label: PortType.PAUSE, target: null },
        ],
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
