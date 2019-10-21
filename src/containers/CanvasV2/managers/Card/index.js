import { BlockType, CardType } from '@/constants';

import CardEditor from './CardEditor';

const CardManager = {
  type: BlockType.CARD,
  editor: CardEditor,
  icon: 'card',

  label: 'Card',
  tip: 'Tell Alexa to show a card',

  addable: true,

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
      title: [],
      content: [],
      largeImage: null,
      smallImage: null,
      hasSmallImage: false,
    },
  }),
};

export default CardManager;
