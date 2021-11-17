import { Creator } from '@test/factories';
import { Node } from '@voiceflow/alexa-types';
import { expect } from 'chai';

import permissionAdapter from '@/adapters/creator/block/alexa/permission';

describe('Adapters | Creator | Block | Alexa | permissionAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.PermissionStepData();

      const result = permissionAdapter.fromDB(data);

      expect(result).eql(data);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = Creator.Block.Alexa.PermissionNodeData();

      const result = permissionAdapter.toDB(data);

      expect(result).eql(data);
    });

    it('filters empty permissions', () => {
      const data = Creator.Block.Alexa.PermissionNodeData({
        permissions: ['   ', '', Node.PermissionType.PAYMENTS_AUTO_PAY_CONSENT] as Node.PermissionType[],
      });

      const result = permissionAdapter.toDB(data);

      expect(result).eql({
        permissions: [Node.PermissionType.PAYMENTS_AUTO_PAY_CONSENT],
      });
    });
  });
});
