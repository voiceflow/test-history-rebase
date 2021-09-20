import { Node } from '@voiceflow/base-types';
import { expect } from 'chai';
import cuid from 'cuid';
import { datatype } from 'faker';
import Sinon from 'sinon';

import setAdapter from '@/adapters/creator/block/migration/set';
import { expressionFactory, setFactory, setStepDataFactory, setV2Factory, setV2NodeDataFactory } from '@/tests/factories/set';

describe('Adapters | Creator | Block | Migration | setAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const id = datatype.uuid();
      Sinon.stub(cuid, 'slug').returns(id);
      const expression = expressionFactory({ type: Node.Utils.ExpressionType.VALUE });
      const set = setFactory({ expression });
      const data = setStepDataFactory({ sets: [set] });

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
      Sinon.stub(cuid, 'slug').returns(id);
      const expression = expressionFactory({ type: Node.Utils.ExpressionType.VARIABLE, value: 'name' });
      const set = setFactory({ expression });
      const data = setStepDataFactory({ sets: [set] });

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
      const data = setV2NodeDataFactory();

      const result = setAdapter.toDB(data);

      expect(result.sets).eql([
        {
          variable: data.sets[0].variable,
          expression: data.sets[0].expression,
        },
      ]);
    });

    it('returns correct data for empty values', () => {
      const set = setV2Factory({ expression: undefined, variable: undefined });
      const data = setV2NodeDataFactory({ sets: [set] });

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
