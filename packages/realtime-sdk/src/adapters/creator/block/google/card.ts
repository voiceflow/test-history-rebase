import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';
import _capitalize from 'lodash/capitalize';

import { createBlockAdapter } from '../utils';

const cardAdapter = createBlockAdapter<Node.Card.StepData, NodeData.Card>(
  ({ type = Node.Card.CardType.SIMPLE, title, text: content, image }) => ({
    cardType: _capitalize(type) as Node.Card.CardType,
    title,
    content,
    largeImage: image?.largeImageUrl || null,
    smallImage: image?.smallImageUrl || null,
    hasSmallImage: !!image?.smallImageUrl,
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
