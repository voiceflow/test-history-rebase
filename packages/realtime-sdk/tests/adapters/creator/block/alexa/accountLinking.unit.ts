import { expect } from 'chai';

import accountLinkingAdapter from '@/adapters/creator/block/alexa/accountLinking';
import { accountLinkingNodeDataFactory, accountLinkingStepDataFactory } from '@/tests/factories/alexa/accountLinking';

describe('Adapters | Creator | Block | Alexa | accountLinkingAdapter', () => {
  describe('when transforming from db', () => {
    it('returns an empty object', () => {
      const data = accountLinkingStepDataFactory();

      const result = accountLinkingAdapter.fromDB(data);

      expect(result).eql({});
    });
  });

  describe('when transforming to db', () => {
    it('returns an empty object', () => {
      const data = accountLinkingNodeDataFactory();

      const result = accountLinkingAdapter.toDB(data);

      expect(result).eql({});
    });
  });
});
