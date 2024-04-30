import { Creator } from '@test/factories';
import { BaseNode } from '@voiceflow/base-types';
import { describe, expect, it } from 'vitest';

import cardAdapter from './card';

describe('Adapters | Creator | Block | Base | cardAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const data = Creator.Block.Base.CardStepData({
        type: BaseNode.Card.CardType.SIMPLE,
        image: { smallImageUrl: 'smallImageURL', largeImageUrl: 'largeImageURL' },
      });

      const result = cardAdapter.fromDB(data, { context: {} });

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
      const data = Creator.Block.Base.CardStepData({
        type: BaseNode.Card.CardType.STANDARD,
        image: { smallImageUrl: undefined, largeImageUrl: undefined },
      });

      const result = cardAdapter.fromDB(data, { context: {} });

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
      const data = Creator.Block.Base.CardNodeData();

      const result = cardAdapter.toDB(data, { context: {} });

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
      const data = Creator.Block.Base.CardNodeData({
        title: undefined,
        content: undefined,
        cardType: undefined,
        largeImage: undefined,
        smallImage: undefined,
        hasSmallImage: false,
      });

      const result = cardAdapter.toDB(data, { context: {} });

      expect(result).eql({
        type: BaseNode.Card.CardType.SIMPLE,
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
