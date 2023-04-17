import customPayloadAdapter from '@realtime-sdk/adapters/creator/block/dialogflow/customPayload';
import { Creator } from '@test/factories';

describe('Adapters | Creator | Block | Dialogflow | customPayloadAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const stepData = Creator.Block.Dialogflow.CustomPayloadStep();

      const result = customPayloadAdapter.fromDB(stepData, { context: {} });

      expect(result).eql({ customPayload: stepData.data });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const nodeData = Creator.Block.Dialogflow.CustomPayloadNodeData();

      const result = customPayloadAdapter.toDB(nodeData, { context: {} });

      expect(result).eql({ data: nodeData.customPayload });
    });
  });
});
