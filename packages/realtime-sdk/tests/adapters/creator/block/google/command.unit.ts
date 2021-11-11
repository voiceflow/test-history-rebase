import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';

import commandAdapter from '@/adapters/creator/block/google/command';
import { Creator } from '@/tests/factories';

describe('Adapters | Creator | Block | Google | Command', () => {
  describe('when transforming from db', () => {
    it('returns correct default values', () => {
      const stepData = Creator.Block.Base.CommandStepData({ diagramID: null, mappings: undefined });

      const result = commandAdapter.fromDB({ ...stepData });

      expect(result).to.eql(
        Creator.Block.Base.CommandNodeData({
          name: stepData.name,
          [Constants.PlatformType.GOOGLE]: {
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
          [Constants.PlatformType.GOOGLE]: {
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
        [Constants.PlatformType.GOOGLE]: { diagramID: '', intent: '', mappings: [{ slot: null, variable: null }] },
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
      const nodeData = Creator.Block.Google.CommandNodeData();

      const result = commandAdapter.toDB({ ...nodeData });

      expect(result).to.eql({
        name: nodeData.name,
        next: null,
        ports: [],
        intent: nodeData[Constants.PlatformType.GOOGLE].intent,
        mappings: nodeData[Constants.PlatformType.GOOGLE].mappings,
        diagramID: nodeData[Constants.PlatformType.GOOGLE].diagramID,
      });
    });
  });
});
