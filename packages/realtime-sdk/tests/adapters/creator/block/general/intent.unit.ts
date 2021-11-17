import { Creator } from '@test/factories';
import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';

import intentAdapter from '@/adapters/creator/block/general/intent';

describe('Adapters | Creator | Block | General | intentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const data = Creator.Block.Base.IntentStepData();

      const result = intentAdapter.fromDB(data);

      expect(result).eql(
        Creator.Block.General.IntentNodeData({
          [Constants.PlatformType.GENERAL]: {
            intent: data.intent,
            mappings: data.mappings!,
            availability: Node.Intent.IntentAvailability.GLOBAL,
          },
        })
      );
    });

    it('returns correct data for empty values', () => {
      const data = Creator.Block.Base.IntentStepData({ mappings: undefined });

      const result = intentAdapter.fromDB(data);

      expect(result).eql(
        Creator.Block.General.IntentNodeData({
          [Constants.PlatformType.GENERAL]: {
            intent: data.intent,
            mappings: [],
            availability: Node.Intent.IntentAvailability.GLOBAL,
          },
        })
      );
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.General.IntentNodeData();

      const result = intentAdapter.toDB(data);

      expect(result).eql(data.general);
    });
  });
});
