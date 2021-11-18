import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Card, Realtime.NodeData.CardBuiltInPorts> = {
  type: BlockType.CARD,

  icon: 'logs',
  iconColor: '#616c60',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          dynamic: [],
          builtIn: { [Models.PortType.NEXT]: { label: Models.PortType.NEXT } },
        },
      },
    },
    data: {
      name: 'Card',
      cardType: Node.Card.CardType.SIMPLE,
      title: '',
      content: '',
      largeImage: null,
      smallImage: null,
      hasSmallImage: false,
    },
  }),
};
