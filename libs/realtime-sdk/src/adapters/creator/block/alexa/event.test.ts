import eventAdapter from '@realtime-sdk/adapters/creator/block/alexa/event';
import { Creator } from '@test/factories';

describe('Adapters | Creator | Block | Alexa | eventAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.EventStepData();

      const result = eventAdapter.fromDB(data);

      expect(result).eql(data);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.EventNodeData();

      const result = eventAdapter.toDB(data);

      expect(result).eql(data);
    });
  });
});
