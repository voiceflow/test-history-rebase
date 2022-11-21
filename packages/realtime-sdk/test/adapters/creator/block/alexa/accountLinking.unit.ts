import accountLinkingAdapter from '@realtime-sdk/adapters/creator/block/alexa/accountLinking';
import { Creator } from '@test/factories';

describe('Adapters | Creator | Block | Alexa | accountLinkingAdapter', () => {
  describe('when transforming from db', () => {
    it('returns an empty object', () => {
      const data = Creator.Block.Alexa.AccountLinkingStepData();

      const result = accountLinkingAdapter.fromDB(data, { context: {} });

      expect(result).eql({});
    });
  });

  describe('when transforming to db', () => {
    it('returns an empty object', () => {
      const data = Creator.Block.Alexa.AccountLinkingNodeData();

      const result = accountLinkingAdapter.toDB(data, { context: {} });

      expect(result).eql({});
    });
  });
});
