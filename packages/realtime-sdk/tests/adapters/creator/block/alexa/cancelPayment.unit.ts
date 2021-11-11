import { expect } from 'chai';

import cancelPaymentAdapter from '@/adapters/creator/block/alexa/cancelPayment';
import { Creator } from '@/tests/factories';

describe('Adapters | Creator | Block | Alexa | cancelPaymentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns given productID', () => {
      const data = Creator.Block.Alexa.CancelPaymentStepData();

      const result = cancelPaymentAdapter.fromDB(data);

      expect(result).eql({ productID: data.productID });
    });
  });

  describe('when transforming to db', () => {
    it('returns given productID', () => {
      const data = Creator.Block.Alexa.CancelPaymentNodeData();

      const result = cancelPaymentAdapter.toDB(data);

      expect(result).eql({ productID: data.productID });
    });

    describe('and productID is null', () => {
      it('returns productID as an empty string', () => {
        const data = Creator.Block.Alexa.CancelPaymentNodeData({ productID: null });

        const result = cancelPaymentAdapter.toDB(data);

        expect(result).eql({ productID: '' });
      });
    });
  });
});
