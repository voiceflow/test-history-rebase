import { Creator } from '@test/factories';
import { BaseNode } from '@voiceflow/base-types';
import { describe, expect, it } from 'vitest';

import displayAdapter from './display';

describe('Adapters | Creator | Block | Alexa | displayAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.DisplayStepData();

      const result = displayAdapter.fromDB(data, { context: {} });

      expect(result).eql({
        title: data.title,
        aplType: data.type,
        imageURL: data.imageURL,
        document: data.document,
        datasource: data.datasource,
        aplCommands: data.aplCommands,
        jsonFileName: data.jsonFileName,
        visualType: BaseNode.Visual.VisualType.APL,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const data = Creator.Block.Alexa.DisplayNodeData();

      const result = displayAdapter.toDB(data, { context: {} });

      expect(result).eql({
        type: data.aplType,
        title: data.title,
        imageURL: data.imageURL,
        document: data.document,
        datasource: data.datasource,
        aplCommands: data.aplCommands,
        jsonFileName: data.jsonFileName,
      });
    });

    it('returns correct data for empty values', () => {
      const data = Creator.Block.Alexa.DisplayNodeData({
        title: undefined,
        imageURL: undefined,
        document: undefined,
        datasource: undefined,
        jsonFileName: undefined,
      });

      const result = displayAdapter.toDB(data, { context: {} });

      expect(result).eql({
        type: data.aplType,
        title: '',
        imageURL: '',
        document: '',
        datasource: '',
        aplCommands: data.aplCommands,
        jsonFileName: '',
      });
    });
  });
});
