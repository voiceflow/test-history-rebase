import { expect } from 'chai';

import streamAdapter from '@/adapters/creator/block/alexa/stream';
import { Creator } from '@/tests/factories';

describe('Adapters | Creator | Block | Alexa | streamAdapter', () => {
  describe('when transforming from db', () => {
    it('returns given data', () => {
      const data = Creator.Block.Alexa.StreamStepData();

      const result = streamAdapter.fromDB(data);

      expect(result).eql(data);
    });

    it('sets default for falsy values', () => {
      const data = Creator.Block.Alexa.StreamStepData({ title: undefined, iconImage: undefined, description: undefined, backgroundImage: undefined });

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
      const data = Creator.Block.Alexa.StreamNodeData();

      const result = streamAdapter.toDB(data);

      expect(result).eql(data);
    });

    it('sets default for falsy values', () => {
      const data = Creator.Block.Alexa.StreamNodeData({ title: undefined, iconImage: undefined, description: undefined, backgroundImage: undefined });

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
