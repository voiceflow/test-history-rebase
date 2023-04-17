import paymentAdapter from '@realtime-sdk/adapters/creator/block/alexa/payment';
import { Creator } from '@test/factories';

describe('Adapters | Creator | Block | Alexa | paymentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.PaymentStepData();

      const result = paymentAdapter.fromDB(data, { context: {} });

      expect(result).eql({ productID: data.productID });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.PaymentNodeData();

      const result = paymentAdapter.toDB(data, { context: {} });

      expect(result).eql({ productID: data.productID });
    });
  });
});
