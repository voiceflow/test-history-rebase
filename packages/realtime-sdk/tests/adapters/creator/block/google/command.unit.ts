import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';

import commandAdapter from '@/adapters/creator/block/google/command';
import { commandNodeDataFactory, commandPlatformDataFactory, commandStepDataFactory } from '@/tests/factories/command';

const emptyPlatformData = commandPlatformDataFactory({ intent: null, diagramID: null, mappings: [] });

describe('Adapters | Creator | Block | Google | Command', () => {
  describe('when transforming from db', () => {
    it('returns correct default values', () => {
      const stepData = commandStepDataFactory({ diagramID: undefined, mappings: undefined });

      const result = commandAdapter.fromDB({ ...stepData });

      expect(result).to.eql({
        name: stepData.name,
        [Constants.PlatformType.GOOGLE]: {
          intent: stepData.intent,
          diagramID: null,
          mappings: [],
        },
        [Constants.PlatformType.GENERAL]: emptyPlatformData,
        [Constants.PlatformType.ALEXA]: emptyPlatformData,
      });
    });

    it('returns correct filled values', () => {
      const stepData = commandStepDataFactory();

      const result = commandAdapter.fromDB({ ...stepData });

      expect(result).to.eql({
        name: stepData.name,
        [Constants.PlatformType.GOOGLE]: {
          intent: stepData.intent,
          diagramID: stepData.diagramID,
          mappings: stepData.mappings,
        },
        [Constants.PlatformType.GENERAL]: emptyPlatformData,
        [Constants.PlatformType.ALEXA]: emptyPlatformData,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct default values', () => {
      const nodeData = commandNodeDataFactory({
        [Constants.PlatformType.GOOGLE]: { diagramID: null, intent: null, mappings: [{ slot: null, variable: null }] },
      });

      const result = commandAdapter.toDB({ ...nodeData });

      expect(result).to.eql({
        name: nodeData.name,
        intent: '',
        diagramID: '',
        mappings: [{ variable: '', slot: '' }],
        next: null,
        ports: [],
      });
    });

    it('returns correct filled values', () => {
      const nodeData = commandNodeDataFactory();

      const result = commandAdapter.toDB({ ...nodeData });

      expect(result).to.eql({
        name: nodeData.name,
        intent: nodeData[Constants.PlatformType.GOOGLE].intent,
        diagramID: nodeData[Constants.PlatformType.GOOGLE].diagramID,
        mappings: nodeData[Constants.PlatformType.GOOGLE].mappings,
        next: null,
        ports: [],
      });
    });
  });
});
