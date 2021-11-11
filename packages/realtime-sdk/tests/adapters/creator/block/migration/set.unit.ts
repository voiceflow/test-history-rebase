import { Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { expect } from 'chai';
import { datatype } from 'faker';
import Sinon from 'sinon';

import setAdapter from '@/adapters/creator/block/migration/set';
import { Creator } from '@/tests/factories';

describe('Adapters | Creator | Block | Migration | setAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const id = datatype.uuid();
      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      const expression = Creator.Block.Base.Expression({ type: Node.Utils.ExpressionType.VALUE });
      const set = Creator.Block.Base.Set({ expression });
      const data = Creator.Block.Base.SetStepData({ sets: [set] });

      const result = setAdapter.fromDB(data);

      expect(result.sets).eql([
        {
          id,
          variable: set.variable,
          type: Node.Utils.ExpressionTypeV2.VALUE,
          expression: expression.value,
        },
      ]);
    });

    it('returns correct expression and type', () => {
      const id = datatype.uuid();
      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      const expression = Creator.Block.Base.Expression({ type: Node.Utils.ExpressionType.VARIABLE, value: 'name' });
      const set = Creator.Block.Base.Set({ expression });
      const data = Creator.Block.Base.SetStepData({ sets: [set] });

      const result = setAdapter.fromDB(data);

      expect(result.sets).eql([
        {
          id,
          variable: set.variable,
          type: Node.Utils.ExpressionTypeV2.ADVANCE,
          expression: '{{[name].name}}',
        },
      ]);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const data = Creator.Block.Base.SetV2NodeData();

      const result = setAdapter.toDB(data);

      expect(result.sets).eql([
        {
          variable: data.sets[0].variable,
          expression: data.sets[0].expression,
        },
      ]);
    });

    it('returns correct data for empty values', () => {
      const set = Creator.Block.Base.SetV2({ expression: undefined, variable: undefined });
      const data = Creator.Block.Base.SetV2NodeData({ sets: [set] });

      const result = setAdapter.toDB(data);

      expect(result.sets).eql([
        {
          variable: null,
          expression: '',
        },
      ]);
    });
  });
});
