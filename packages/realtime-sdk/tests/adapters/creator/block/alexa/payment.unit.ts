import { expect } from 'chai';

import paymentAdapter from '@/adapters/creator/block/alexa/payment';
import { Creator } from '@/tests/factories';

describe('Adapters | Creator | Block | Alexa | paymentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.PaymentStepData();

      const result = paymentAdapter.fromDB(data);

      expect(result).eql({ productID: data.productID });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.PaymentNodeData();

      const result = paymentAdapter.toDB(data);

      expect(result).eql({ productID: data.productID });
    });
  });
});
