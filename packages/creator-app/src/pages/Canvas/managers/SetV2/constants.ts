import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const MAX_SETS = 20;

export const setFactory = (): Realtime.NodeData.SetExpressionV2 => ({
  id: Utils.id.cuid.slug(),
  type: BaseNode.Utils.ExpressionTypeV2.ADVANCE,
  variable: null,
  expression: '',
});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = {
  type: BlockType.SETV2,
  icon: 'code',

  factory: (_data) => ({
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
      name: 'Set',
      title: '',
      sets: [setFactory()],
    },
  }),
};
