import commandAdapter from '@realtime-sdk/adapters/creator/block/alexa/command';
import { Creator } from '@test/factories';
import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';

describe('Adapters | Creator | Block | Alexa | Command', () => {
  describe('when transforming from db', () => {
    it('returns correct default values', () => {
      const stepData = Creator.Block.Base.CommandStepData({ diagramID: undefined, mappings: undefined });

      const result = commandAdapter.fromDB({ ...stepData });

      expect(result).to.eql(
        Creator.Block.Base.CommandNodeData({
          name: stepData.name,
          [Constants.PlatformType.ALEXA]: {
            intent: stepData.intent,
            mappings: [],
            diagramID: null,
          },
        })
      );
    });

    it('returns correct filled values', () => {
      const stepData = Creator.Block.Base.CommandStepData();

      const result = commandAdapter.fromDB({ ...stepData });

      expect(result).to.eql(
        Creator.Block.Base.CommandNodeData({
          name: stepData.name,
          [Constants.PlatformType.ALEXA]: {
            intent: stepData.intent,
            mappings: stepData.mappings!,
            diagramID: stepData.diagramID,
          },
        })
      );
    });
  });

  describe('when transforming to db', () => {
    it('returns correct default values', () => {
      const nodeData = Creator.Block.Alexa.CommandNodeData({
        [Constants.PlatformType.ALEXA]: { diagramID: null, intent: null, mappings: [{ slot: null, variable: null }] },
      });

      const result = commandAdapter.toDB({ ...nodeData });

      expect(result).to.eql({
        name: nodeData.name,
        next: null,
        ports: [],
        intent: '',
        mappings: [{ variable: '', slot: '' }],
        diagramID: '',
      });
    });

    it('returns correct filled values', () => {
      const nodeData = Creator.Block.Alexa.CommandNodeData();

      const result = commandAdapter.toDB({ ...nodeData });

      expect(result).to.eql({
        name: nodeData.name,
        next: null,
        ports: [],
        intent: nodeData[Constants.PlatformType.ALEXA].intent,
        mappings: nodeData[Constants.PlatformType.ALEXA].mappings,
        diagramID: nodeData[Constants.PlatformType.ALEXA].diagramID,
      });
    });
  });
});
