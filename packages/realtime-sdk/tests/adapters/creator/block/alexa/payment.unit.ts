import { expect } from 'chai';

import paymentAdapter from '@/adapters/creator/block/alexa/payment';
import { paymentNodeDataFactory, paymentStepDataFactory } from '@/tests/factories/alexa/payment';

describe('Adapters | Creator | Block | Alexa | paymentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = paymentStepDataFactory();

      const result = paymentAdapter.fromDB(data);

      expect(result).eql({ productID: data.productID });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = paymentNodeDataFactory();

      const result = paymentAdapter.toDB(data);

      expect(result).eql({ productID: data.productID });
    });
  });
});
