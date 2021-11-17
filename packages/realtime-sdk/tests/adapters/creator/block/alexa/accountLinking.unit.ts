import accountLinkingAdapter from '@realtime-sdk/adapters/creator/block/alexa/accountLinking';
import { Creator } from '@test/factories';
import { expect } from 'chai';

describe('Adapters | Creator | Block | Alexa | accountLinkingAdapter', () => {
  describe('when transforming from db', () => {
    it('returns an empty object', () => {
      const data = Creator.Block.Alexa.AccountLinkingStepData();

      const result = accountLinkingAdapter.fromDB(data);

      expect(result).eql({});
    });
  });

  describe('when transforming to db', () => {
    it('returns an empty object', () => {
      const data = Creator.Block.Alexa.AccountLinkingNodeData();

      const result = accountLinkingAdapter.toDB(data);

      expect(result).eql({});
    });
  });
});
