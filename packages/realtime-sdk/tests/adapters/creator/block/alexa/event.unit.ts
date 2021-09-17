import { expect } from 'chai';

import eventAdapter from '@/adapters/creator/block/alexa/event';
import { eventNodeDataFactory, eventStepDataFactory } from '@/tests/factories/alexa/event';

describe('Adapters | Creator | Block | Alexa | eventAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = eventStepDataFactory();

      const result = eventAdapter.fromDB(data);

      expect(result).eql(data);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = eventNodeDataFactory();

      const result = eventAdapter.toDB(data);

      expect(result).eql(data);
    });
  });
});
