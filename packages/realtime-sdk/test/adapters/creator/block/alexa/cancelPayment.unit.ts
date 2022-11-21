import cancelPaymentAdapter from '@realtime-sdk/adapters/creator/block/alexa/cancelPayment';
import { Creator } from '@test/factories';

describe('Adapters | Creator | Block | Alexa | cancelPaymentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns given productID', () => {
      const data = Creator.Block.Alexa.CancelPaymentStepData();

      const result = cancelPaymentAdapter.fromDB(data, { context: {} });

      expect(result).eql({ productID: data.productID });
    });
  });

  describe('when transforming to db', () => {
    it('returns given productID', () => {
      const data = Creator.Block.Alexa.CancelPaymentNodeData();

      const result = cancelPaymentAdapter.toDB(data, { context: {} });

      expect(result).eql({ productID: data.productID });
    });

    describe('and productID is null', () => {
      it('returns productID as an empty string', () => {
        const data = Creator.Block.Alexa.CancelPaymentNodeData({ productID: null });

        const result = cancelPaymentAdapter.toDB(data, { context: {} });

        expect(result).eql({ productID: '' });
      });
    });
  });
});
