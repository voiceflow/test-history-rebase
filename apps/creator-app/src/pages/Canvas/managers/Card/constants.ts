import { BaseModels, BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import type { NodeConfig } from '../types';

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Card, Realtime.NodeData.CardBuiltInPorts> = {
  type: BlockType.CARD,
  icon: 'cardV2',

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
      name: 'Card',
      cardType: BaseNode.Card.CardType.SIMPLE,
      title: '',
      content: '',
      largeImage: null,
      smallImage: null,
      hasSmallImage: false,
    },
  }),
};
