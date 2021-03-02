import { BlockType } from '@/constants';
import { PortType } from '@/constants/canvas';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

export const HELP_LINK = 'https://docs.voiceflow.com/#/alexa/stream-block';

export const NODE_CONFIG: NodeConfig<NodeData.Stream> = {
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
