import { Creator } from '@test/factories';
import { describe, expect, it } from 'vitest';

import eventAdapter from './event';

describe('Adapters | Creator | Block | Alexa | eventAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.EventStepData();

      const result = eventAdapter.fromDB(data, { context: {} });

      expect(result).eql(data);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.EventNodeData();

      const result = eventAdapter.toDB(data, { context: {} });

      expect(result).eql(data);
    });
  });
});
