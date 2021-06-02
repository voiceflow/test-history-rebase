import { BlockType, CardType } from '@/constants';
import { NodeData } from '@/models';

import { NodeConfig } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const NODE_CONFIG: NodeConfig<NodeData.Card> = {
  type: BlockType.CARD,

  icon: 'logs',
  iconColor: '#616c60',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: [{}],
      },
    },
    data: {
      name: 'Card',
      cardType: CardType.SIMPLE,
      title: '',
      content: '',
      largeImage: null,
      smallImage: null,
      hasSmallImage: false,
    },
  }),
};
