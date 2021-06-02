import { CardType, StepData } from '@voiceflow/google-types/build/nodes/card';
import _capitalize from 'lodash/capitalize';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const cardAdapter = createBlockAdapter<StepData, NodeData.Card>(
  ({ type = CardType.SIMPLE, title, text: content, image }) => ({
    cardType: _capitalize(type) as CardType,
    title,
    content,
    hasSmallImage: !!image?.smallImageUrl,
    largeImage: image?.largeImageUrl || null,
    smallImage: image?.smallImageUrl || null,
  }),
  ({ cardType: type = CardType.SIMPLE, title = '', content: text = '', largeImage, smallImage }) => ({
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
