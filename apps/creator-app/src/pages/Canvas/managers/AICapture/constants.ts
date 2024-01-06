import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.AICapture, Realtime.NodeData.AICaptureBuiltInPorts> = {
  type: BlockType.AI_CAPTURE,
  icon: 'captureV2',

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
            [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH },
            [BaseModels.PortType.NO_REPLY]: { label: BaseModels.PortType.NO_REPLY },
          },
        },
      },
    },
    data: {
      name: 'Capture AI',
      entities: [''],
      rules: [],
      exitScenerios: [],
      exitPath: false,
    },
  }),
};
