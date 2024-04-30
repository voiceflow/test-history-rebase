import { Creator } from '@test/factories';
import { describe, expect, it } from 'vitest';

import commandAdapter from './command';

describe('Adapters | Creator | Block | Alexa | Command', () => {
  describe('when transforming from db', () => {
    it('returns correct default values', () => {
      const stepData = Creator.Block.Base.CommandStepData({ diagramID: undefined, mappings: undefined });

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
      const nodeData = Creator.Block.Alexa.CommandNodeData({
        diagramID: null,
        intent: null,
        mappings: [{ slot: null, variable: null }],
      });

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
      const nodeData = Creator.Block.Alexa.CommandNodeData();

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
