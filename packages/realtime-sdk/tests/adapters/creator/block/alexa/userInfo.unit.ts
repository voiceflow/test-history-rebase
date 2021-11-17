import { Creator } from '@test/factories';
import { Utils } from '@voiceflow/common';
import { expect } from 'chai';
import { datatype } from 'faker';
import Sinon from 'sinon';

import userInfoAdapter from '@/adapters/creator/block/alexa/userInfo';

describe('Adapters | Creator | Block | Alexa | userInfoAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('maps all infos to permissions', () => {
      const id = datatype.uuid();
      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      const data = Creator.Block.Alexa.UserInfoStepData();

      const result = userInfoAdapter.fromDB(data);

      const info = data.infos[0];
      expect(result.permissions).eql([{ id, mapTo: info.mapTo, product: info.product, selected: info.type }]);
    });
  });

  describe('when transforming to db', () => {
    it('maps infos to permissions', () => {
      const data = Creator.Block.Alexa.UserInfoNodeData();

      const result = userInfoAdapter.toDB(data);

      const permission = data.permissions[0];
      expect(result.infos).eql([{ type: permission.selected, mapTo: permission.mapTo, product: permission.product }]);
    });
  });
});
