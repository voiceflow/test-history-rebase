import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Directive, Realtime.NodeData.DirectiveBuiltInPorts> = {
  type: BlockType.DIRECTIVE,
  icon: 'directiveV2',

  tooltipLink: Documentation.ALEXA_DIRECTIVE_STEP,
  tooltipText: 'Sends customized directives for channel features in JSON',

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
      name: 'Directive',
      directive: '',
    },
  }),
};
