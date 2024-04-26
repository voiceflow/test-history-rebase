import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CustomPayload, Realtime.NodeData.CustomPayloadBuiltInPorts> = {
  type: BlockType.PAYLOAD,
  icon: 'customResponseV2',

  tooltipLink: Documentation.CUSTOM_RESPOSE,
  tooltipText: 'Sends customized response for Dialogflow features',

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
      name: 'Custom Response',
      customPayload: '',
    },
  }),
};
