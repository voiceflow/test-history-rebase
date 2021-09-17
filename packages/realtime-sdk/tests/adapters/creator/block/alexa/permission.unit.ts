import { PermissionType } from '@voiceflow/alexa-types/build/node';
import { expect } from 'chai';

import permissionAdapter from '@/adapters/creator/block/alexa/permission';
import { permissionNodeDataFactory, permissionStepDataFactory } from '@/tests/factories/alexa/permission';

describe('Adapters | Creator | Block | permissionAdapter', () => {
  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const data = permissionStepDataFactory();

      const result = permissionAdapter.fromDB(data);

      expect(result).eql(data);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const data = permissionNodeDataFactory();

      const result = permissionAdapter.toDB(data);

      expect(result).eql(data);
    });

    it('filters empty permissions', () => {
      const data = permissionNodeDataFactory({
        permissions: ['   ', '', PermissionType.PAYMENTS_AUTO_PAY_CONSENT] as PermissionType[],
      });

      const result = permissionAdapter.toDB(data);

      expect(result).eql({
        permissions: [PermissionType.PAYMENTS_AUTO_PAY_CONSENT],
      });
    });
  });
});
