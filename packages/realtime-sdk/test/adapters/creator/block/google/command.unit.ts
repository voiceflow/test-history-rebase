import commandAdapter from '@realtime-sdk/adapters/creator/block/google/command';
import { Creator } from '@test/factories';

describe('Adapters | Creator | Block | Google | Command', () => {
  describe('when transforming from db', () => {
    it('returns correct default values', () => {
      const stepData = Creator.Block.Base.CommandStepData({ diagramID: null, mappings: undefined });

      const result = commandAdapter.fromDB({ ...stepData }, { context: {} });

      expect(result).to.eql(
        Creator.Block.Base.CommandNodeData({
          name: stepData.name,
          intent: stepData.intent,
          mappings: [],
          diagramID: null,
        })
      );
    });

    it('returns correct filled values', () => {
      const stepData = Creator.Block.Base.CommandStepData();

      const result = commandAdapter.fromDB({ ...stepData }, { context: {} });

      expect(result).to.eql(
        Creator.Block.Base.CommandNodeData({
          name: stepData.name,
          intent: stepData.intent,
          mappings: stepData.mappings!,
          diagramID: stepData.diagramID,
        })
      );
    });
  });

  describe('when transforming to db', () => {
    it('returns correct default values', () => {
      const nodeData = Creator.Block.Alexa.CommandNodeData({ diagramID: '', intent: '', mappings: [{ slot: null, variable: null }] });

      const result = commandAdapter.toDB({ ...nodeData }, { context: {} });

      expect(result).to.eql({
        name: nodeData.name,
        next: null,
        intent: '',
        mappings: [{ variable: '', slot: '' }],
        diagramID: '',
      });
    });

    it('returns correct filled values', () => {
      const nodeData = Creator.Block.Google.CommandNodeData();

      const result = commandAdapter.toDB({ ...nodeData }, { context: {} });

      expect(result).to.eql({
        name: nodeData.name,
        next: null,
        intent: nodeData.intent,
        mappings: nodeData.mappings,
        diagramID: nodeData.diagramID,
      });
    });
  });
});
