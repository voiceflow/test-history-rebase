import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = {
  type: BlockType.DISPLAY,
  icon: 'displayV2',

  tooltipLink: Documentation.DISPLAY_STEP,
  tooltipText: 'Creates visuals for Alexa devices using APL.',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: { [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Display',
      title: '',
      aplType: BaseNode.Visual.APLType.SPLASH,
      visualType: BaseNode.Visual.VisualType.APL,
      imageURL: '',
      document: '',
      datasource: '',
      jsonFileName: '',
    },
  }),
};
