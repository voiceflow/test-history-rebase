import { PlatformType } from '@voiceflow/internal';
import { expect } from 'chai';

import commandAdapter from '@/adapters/creator/block/alexa/command';
import { commandNodeDataFactory, commandPlatformDataFactory, commandStepDataFactory } from '@/tests/factories/command';

const emptyPlatformData = commandPlatformDataFactory({ intent: null, diagramID: null, mappings: [] });

describe('Adapters | Creator | Block | Alexa | Command', () => {
  describe('when transforming from db', () => {
    it('returns correct default values', () => {
      const stepData = commandStepDataFactory({ diagramID: undefined, mappings: undefined });

      const result = commandAdapter.fromDB({ ...stepData });

      expect(result).to.eql({
        name: stepData.name,
        [PlatformType.ALEXA]: {
          intent: stepData.intent,
          diagramID: null,
          mappings: [],
        },
        [PlatformType.GENERAL]: emptyPlatformData,
        [PlatformType.GOOGLE]: emptyPlatformData,
      });
    });

    it('returns correct filled values', () => {
      const stepData = commandStepDataFactory();

      const result = commandAdapter.fromDB({ ...stepData });

      expect(result).to.eql({
        name: stepData.name,
        [PlatformType.ALEXA]: {
          intent: stepData.intent,
          diagramID: stepData.diagramID,
          mappings: stepData.mappings,
        },
        [PlatformType.GENERAL]: emptyPlatformData,
        [PlatformType.GOOGLE]: emptyPlatformData,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct default values', () => {
      const nodeData = commandNodeDataFactory({
        [PlatformType.ALEXA]: { diagramID: null, intent: null, mappings: [{ slot: null, variable: null }] },
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
        intent: nodeData[PlatformType.ALEXA].intent,
        diagramID: nodeData[PlatformType.ALEXA].diagramID,
        mappings: nodeData[PlatformType.ALEXA].mappings,
        next: null,
        ports: [],
      });
    });
  });
});
