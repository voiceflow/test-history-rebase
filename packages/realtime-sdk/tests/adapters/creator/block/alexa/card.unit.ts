import { Node } from '@voiceflow/base-types';
import { CardType } from '@voiceflow/base-types/build/node/card';
import { expect } from 'chai';

import cardAdapter from '@/adapters/creator/block/alexa/card';
import { cardNodeDataFactory, cardStepDataFactory } from '@/tests/factories/card';

describe('Adapters | Creator | Block | Alexa | cardAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const data = cardStepDataFactory({ type: CardType.SIMPLE, image: { smallImageUrl: 'smallImageURL', largeImageUrl: 'largeImageURL' } });

      const result = cardAdapter.fromDB(data);

      expect(result).eql({
        cardType: 'Simple',
        title: data.title,
        content: data.text,
        hasSmallImage: true,
        largeImage: 'largeImageURL',
        smallImage: 'smallImageURL',
      });
    });

    it('returns correct data for empty values', () => {
      const data = cardStepDataFactory({ type: CardType.STANDARD, image: { smallImageUrl: undefined, largeImageUrl: undefined } });

      const result = cardAdapter.fromDB(data);

      expect(result).eql({
        cardType: 'Standard',
        title: data.title,
        content: data.text,
        hasSmallImage: false,
        largeImage: null,
        smallImage: null,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const data = cardNodeDataFactory();

      const result = cardAdapter.toDB(data);

      expect(result).eql({
        type: data.cardType,
        title: data.title,
        text: data.content,
        image: {
          smallImageUrl: data.smallImage,
          largeImageUrl: data.largeImage,
        },
      });
    });

    it('returns correct data for empty values', () => {
      const data = cardNodeDataFactory({
        cardType: undefined,
        title: undefined,
        content: undefined,
        largeImage: undefined,
        hasSmallImage: false,
        smallImage: undefined,
      });

      const result = cardAdapter.toDB(data);

      expect(result).eql({
        type: Node.Card.CardType.SIMPLE,
        title: '',
        text: '',
        image: {
          smallImageUrl: undefined,
          largeImageUrl: undefined,
        },
      });
    });
  });
});
