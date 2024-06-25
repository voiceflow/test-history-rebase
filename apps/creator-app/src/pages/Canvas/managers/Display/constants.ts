import { BaseModels, BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const displayFactory = (aplType = BaseNode.Visual.APLType.SPLASH): BaseNode.Visual.APLStepData => ({
  title: '',
  aplType,
  visualType: BaseNode.Visual.VisualType.APL,
  imageURL: '',
  document: '',
  datasource: '',
  jsonFileName: '',
});

export const NODE_CONFIG: NodeConfig<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = {
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
      ...displayFactory(),
    },
  }),
};
