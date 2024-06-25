import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const MAX_IF_ITEMS = 22;

export const expressionFactory = (): Realtime.ExpressionData => ({
  id: Utils.id.cuid.slug(),
  type: null,
  value: [],
  name: '',
});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = {
  type: BlockType.IFV2,
  icon: 'ifV2',

  mergeTerminator: true,

  factory: (_data) => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [{}],
          builtIn: { [BaseModels.PortType.NO_MATCH]: { label: BaseModels.PortType.NO_MATCH } },
        },
      },
    },
    data: {
      name: 'If',
      expressions: [expressionFactory()],
      noMatch: {
        type: BaseNode.IfV2.IfNoMatchType.NONE,
        pathName: 'No match',
      },
    },
  }),
};
