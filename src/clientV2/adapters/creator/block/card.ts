import { CardType, StepData } from '@voiceflow/alexa-types/build/nodes/card';
import _capitalize from 'lodash/capitalize';

import { createBlockAdapter } from '@/client/adapters/creator/block/utils';
import { NodeData } from '@/models';

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
