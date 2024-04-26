import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Url, Realtime.NodeData.UrlBuiltInPorts> = {
  type: BlockType.URL,
  icon: 'editorURL',

  factory: ({ name = '', url = '' } = {}) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
          },
        },
      },
    },
    data: { name, url },
  }),
};
