import intentAdapter from '@realtime-sdk/adapters/creator/block/alexa/intent';
import { Creator } from '@test/factories';
import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';

describe('Adapters | Creator | Block | Alexa | intentAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const data = Creator.Block.Base.IntentStepData();

      const result = intentAdapter.fromDB(data);

      expect(result).eql(
        Creator.Block.Alexa.IntentNodeData({
          [Constants.PlatformType.ALEXA]: {
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
        Creator.Block.Alexa.IntentNodeData({
          [Constants.PlatformType.ALEXA]: {
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
      const data = Creator.Block.Alexa.IntentNodeData();

      const result = intentAdapter.toDB(data);

      expect(result).eql(data.alexa);
    });
  });
});
