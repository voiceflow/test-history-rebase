import { Models, Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
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
          builtIn: { [Models.PortType.NO_MATCH]: { label: Models.PortType.NO_MATCH } },
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
        type: Node.IfV2.IfNoMatchType.NONE,
        pathName: 'No Match',
      },
    },
  }),
};
