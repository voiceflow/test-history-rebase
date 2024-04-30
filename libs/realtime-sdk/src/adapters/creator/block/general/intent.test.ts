import { Creator } from '@test/factories';
import { BaseNode } from '@voiceflow/base-types';
import { describe, expect, it } from 'vitest';

import intentAdapter from './intent';

describe('Adapters | Creator | Block | General | intentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const data = Creator.Block.Base.IntentStepData();

      const result = intentAdapter.fromDB(data, { context: {} });

      expect(result).eql(
        Creator.Block.General.IntentNodeData({
          intent: data.intent,
          mappings: data.mappings!,
          availability: BaseNode.Intent.IntentAvailability.GLOBAL,
        })
      );
    });

    it('returns correct data for empty values', () => {
      const data = Creator.Block.Base.IntentStepData({ mappings: undefined });

      const result = intentAdapter.fromDB(data, { context: {} });

      expect(result).eql(
        Creator.Block.General.IntentNodeData({
          intent: data.intent,
          mappings: [],
          availability: BaseNode.Intent.IntentAvailability.GLOBAL,
        })
      );
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.General.IntentNodeData();

      const result = intentAdapter.toDB(data, { context: {} });

      expect(result).eql(data);
    });
  });
});
