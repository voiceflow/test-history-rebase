import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Stream, Realtime.NodeData.StreamBuiltInPorts> = {
  type: BlockType.STREAM,
  icon: 'audioPlayer',
  mergeTerminator: true,

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.PAUSE]: { label: BaseModels.PortType.PAUSE },
            [BaseModels.PortType.PREVIOUS]: { label: BaseModels.PortType.PREVIOUS },
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
