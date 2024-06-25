import { BaseModels, BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> = {
  type: BlockType.INTEGRATION,

  icon: 'integrations',

  tooltipText: 'Makes custom API calls to external APIs and data.',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
            [BaseModels.PortType.FAIL]: { label: BaseModels.PortType.FAIL },
          },
        },
      },
    },
    data: {
      name: '',
      selectedIntegration: BaseNode.Utils.IntegrationType.CUSTOM_API,
      url: '',
      body: [],
      headers: [],
      mapping: [],
      content: '',
      parameters: [],
      bodyInputType: BaseNode.Api.APIBodyType.FORM_DATA,
      selectedAction: BaseNode.Api.APIActionType.GET,
    },
  }),
};
