import { Creator } from '@test/factories';
import { AlexaNode } from '@voiceflow/alexa-types';
import { describe, expect, it } from 'vitest';

import permissionAdapter from './permission';

describe('Adapters | Creator | Block | Alexa | permissionAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.PermissionStepData();

      const result = permissionAdapter.fromDB(data, { context: {} });

      expect(result).eql(data);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.PermissionNodeData();

      const result = permissionAdapter.toDB(data, { context: {} });

      expect(result).eql(data);
    });

    it('filters empty permissions', () => {
      const data = Creator.Block.Alexa.PermissionNodeData({
        permissions: ['   ', '', AlexaNode.PermissionType.PAYMENTS_AUTO_PAY_CONSENT] as AlexaNode.PermissionType[],
      });

      const result = permissionAdapter.toDB(data, { context: {} });

      expect(result).eql({
        permissions: [AlexaNode.PermissionType.PAYMENTS_AUTO_PAY_CONSENT],
      });
    });
  });
});
