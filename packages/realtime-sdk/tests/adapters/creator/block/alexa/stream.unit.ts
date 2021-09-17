import { expect } from 'chai';

import streamAdapter from '@/adapters/creator/block/alexa/stream';
import { streamNodeDataFactory, streamStepDataFactory } from '@/tests/factories/alexa/stream';

describe('Adapters | Creator | Block | streamAdapter', () => {
  describe('when transforming from db', () => {
    it('returns given data', () => {
      const data = streamStepDataFactory();

      const result = streamAdapter.fromDB(data);

      expect(result).eql(data);
    });

    it('sets default for falsy values', () => {
      const data = streamStepDataFactory({ title: undefined, iconImage: undefined, description: undefined, backgroundImage: undefined });

      const result = streamAdapter.fromDB(data);

      expect(result).includes({
        title: null,
        iconImage: null,
        description: null,
        backgroundImage: null,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns given data', () => {
      const data = streamNodeDataFactory();

      const result = streamAdapter.toDB(data);

      expect(result).eql(data);
    });

    it('sets default for falsy values', () => {
      const data = streamNodeDataFactory({ title: undefined, iconImage: undefined, description: undefined, backgroundImage: undefined });

      const result = streamAdapter.toDB(data);

      expect(result).includes({
        title: undefined,
        iconImage: undefined,
        description: undefined,
        backgroundImage: undefined,
      });
    });
  });
});
