import { draftJSContentAdapter } from '@/client/adapters/draft';
import { CardType } from '@/constants';

import { createBlockAdapter } from './utils';

const cardBlockAdapter = createBlockAdapter(
  ({ cardtype, title, content, large_img, small_img }) => ({
    cardType: cardtype === 'Simple' ? CardType.SIMPLE : CardType.STANDARD,
    title: draftJSContentAdapter.fromDB(title),
    content: draftJSContentAdapter.fromDB(content),
    largeImage: large_img || null,
    smallImage: small_img || null,
    hasSmallImage: !!small_img,
  }),
  ({ cardType, title, content, largeImage, smallImage }) => ({
    cardtype: cardType === CardType.SIMPLE ? 'Simple' : 'Standard',
    title: draftJSContentAdapter.toDB(title),
    content: draftJSContentAdapter.toDB(content),
    large_img: largeImage,
    small_img: smallImage,
  })
);

export default cardBlockAdapter;
