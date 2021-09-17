import { expect } from 'chai';

import cancelPaymentAdapter from '@/adapters/creator/block/alexa/cancelPayment';
import { cancelPaymentNodeDataFactory, cancelPaymentStepDataFactory } from '@/tests/factories/alexa/cancelPayment';

describe('Adapters | Creator | Block | Alexa | cancelPaymentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns given productID', () => {
      const data = cancelPaymentStepDataFactory();

      const result = cancelPaymentAdapter.fromDB(data);

      expect(result).eql({ productID: data.productID });
    });
  });

  describe('when transforming to db', () => {
    it('returns given productID', () => {
      const data = cancelPaymentNodeDataFactory();

      const result = cancelPaymentAdapter.toDB(data);

      expect(result).eql({ productID: data.productID });
    });

    describe('and productID is null', () => {
      it('returns productID as an empty string', () => {
        const data = cancelPaymentNodeDataFactory({ productID: null });

        const result = cancelPaymentAdapter.toDB(data);

        expect(result).eql({ productID: '' });
      });
    });
  });
});
