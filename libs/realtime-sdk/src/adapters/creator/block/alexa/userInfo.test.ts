import { faker } from '@faker-js/faker';
import { Creator } from '@test/factories';
import { Utils } from '@voiceflow/common';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import userInfoAdapter from './userInfo';

describe('Adapters | Creator | Block | Alexa | userInfoAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('maps all infos to permissions', () => {
      const id = faker.datatype.uuid();

      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue(id);

      const data = Creator.Block.Alexa.UserInfoStepData();

      const result = userInfoAdapter.fromDB(data, { context: {} });

      const info = data.infos[0];
      expect(result.permissions).eql([{ id, mapTo: info.mapTo, product: info.product, selected: info.type }]);
    });
  });

  describe('when transforming to db', () => {
    it('maps infos to permissions', () => {
      const data = Creator.Block.Alexa.UserInfoNodeData();

      const result = userInfoAdapter.toDB(data, { context: {} });

      const permission = data.permissions[0];
      expect(result.infos).eql([{ type: permission.selected, mapTo: permission.mapTo, product: permission.product }]);
    });
  });
});
