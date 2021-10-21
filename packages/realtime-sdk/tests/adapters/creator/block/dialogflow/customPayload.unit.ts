import { expect } from 'chai';

import customPayloadAdapter from '@/adapters/creator/block/dialogflow/customPayload';
import { payloadNodeDataFactory, payloadStepFactory } from '@/tests/factories/dialogflow/customPayload';

describe('Adapters | Creator | Block | Dialogflow | customPayloadAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const stepData = payloadStepFactory();

      const result = customPayloadAdapter.fromDB(stepData);

      expect(result).eql({ customPayload: stepData.data });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const nodeData = payloadNodeDataFactory();

      const result = customPayloadAdapter.toDB(nodeData);

      expect(result).eql({ data: nodeData.customPayload });
    });
  });
});
