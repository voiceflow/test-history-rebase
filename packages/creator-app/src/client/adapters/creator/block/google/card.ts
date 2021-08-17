import { Node } from '@voiceflow/base-types';
import _capitalize from 'lodash/capitalize';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const cardAdapter = createBlockAdapter<Node.Card.StepData, NodeData.Card>(
  ({ type = Node.Card.CardType.SIMPLE, title, text: content, image }) => ({
    cardType: _capitalize(type) as Node.Card.CardType,
    title,
    content,
    hasSmallImage: !!image?.smallImageUrl,
    largeImage: image?.largeImageUrl || null,
    smallImage: image?.smallImageUrl || null,
  }),
  ({ cardType: type = Node.Card.CardType.SIMPLE, title = '', content: text = '', largeImage, smallImage }) => ({
    type,
    title,
    text,
    image: {
      smallImageUrl: smallImage || undefined,
      largeImageUrl: largeImage || undefined,
    },
  })
);

export default cardAdapter;
