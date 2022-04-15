import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const MAX_IF_ITEMS = 22;

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = {
  type: BlockType.IFV2,
  icon: 'if',

  mergeTerminator: true,

  factory: (_data) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [{}],
          builtIn: { [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH } },
        },
      },
    },
    data: {
      name: 'If',
      expressions: [
        {
          id: Utils.id.cuid.slug(),
          type: null,
          value: [],
        },
      ],
      noMatch: {
        type: BaseNode.IfV2.IfNoMatchType.NONE,
        pathName: 'No Match',
      },
    },
  }),
};
