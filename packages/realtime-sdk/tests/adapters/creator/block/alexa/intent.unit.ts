import { PlatformType } from '@voiceflow/internal';
import { expect } from 'chai';

import intentAdapter from '@/adapters/creator/block/alexa/intent';
import { intentNodeDataFactory, intentStepDataFactory } from '@/tests/factories/intent';

describe('Adapters | Creator | Block | Alexa | intentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const data = intentStepDataFactory();

      const result = intentAdapter.fromDB(data);

      expect(result).eql({
        [PlatformType.ALEXA]: {
          intent: data.intent,
          mappings: data.mappings,
        },
        [PlatformType.GOOGLE]: {
          intent: null,
          mappings: [],
        },
        [PlatformType.GENERAL]: {
          intent: null,
          mappings: [],
        },
      });
    });

    it('returns correct data for empty values', () => {
      const data = intentStepDataFactory({ mappings: undefined });

      const result = intentAdapter.fromDB(data);

      expect(result).eql({
        [PlatformType.ALEXA]: {
          intent: data.intent,
          mappings: [],
        },
        [PlatformType.GOOGLE]: {
          intent: null,
          mappings: [],
        },
        [PlatformType.GENERAL]: {
          intent: null,
          mappings: [],
        },
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = intentNodeDataFactory();

      const result = intentAdapter.toDB(data);

      expect(result).eql(data.alexa);
    });
  });
});
