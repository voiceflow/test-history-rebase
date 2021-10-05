import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';

import intentAdapter from '@/adapters/creator/block/general/intent';
import { intentNodeDataFactory, intentStepDataFactory } from '@/tests/factories/intent';

describe('Adapters | Creator | Block | General | intentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const data = intentStepDataFactory();

      const result = intentAdapter.fromDB(data);

      expect(result).eql({
        [Constants.PlatformType.GENERAL]: {
          intent: data.intent,
          mappings: data.mappings,
          availability: Node.Intent.IntentAvailability.GLOBAL,
        },
        [Constants.PlatformType.GOOGLE]: {
          intent: null,
          mappings: [],
          availability: Node.Intent.IntentAvailability.GLOBAL,
        },
        [Constants.PlatformType.ALEXA]: {
          intent: null,
          mappings: [],
          availability: Node.Intent.IntentAvailability.GLOBAL,
        },
      });
    });

    it('returns correct data for empty values', () => {
      const data = intentStepDataFactory({ mappings: undefined });

      const result = intentAdapter.fromDB(data);

      expect(result).eql({
        [Constants.PlatformType.GENERAL]: {
          intent: data.intent,
          mappings: [],
          availability: Node.Intent.IntentAvailability.GLOBAL,
        },
        [Constants.PlatformType.GOOGLE]: {
          intent: null,
          mappings: [],
          availability: Node.Intent.IntentAvailability.GLOBAL,
        },
        [Constants.PlatformType.ALEXA]: {
          intent: null,
          mappings: [],
          availability: Node.Intent.IntentAvailability.GLOBAL,
        },
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = intentNodeDataFactory();

      const result = intentAdapter.toDB(data);

      expect(result).eql(data.general);
    });
  });
});
