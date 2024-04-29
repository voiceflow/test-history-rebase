import { faker } from '@faker-js/faker';
import setAdapter from '@realtime-sdk/adapters/creator/block/migration/set';
import { Creator } from '@test/factories';
import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

describe('Adapters | Creator | Block | Migration | setAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const id = faker.datatype.uuid();
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue(id);
      const expression = Creator.Block.Base.Expression({ type: BaseNode.Utils.ExpressionType.VALUE });
      const set = Creator.Block.Base.Set({ expression });
      const data = Creator.Block.Base.SetStepData({ sets: [set] });

      const result = setAdapter.fromDB(data, { context: {} });

      expect(result.sets).eql([
        {
          id,
          variable: set.variable,
          type: BaseNode.Utils.ExpressionTypeV2.VALUE,
          expression: expression.value,
        },
      ]);
    });

    it('returns correct expression and type', () => {
      const id = faker.datatype.uuid();
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue(id);
      const expression = Creator.Block.Base.Expression({ type: BaseNode.Utils.ExpressionType.VARIABLE, value: 'name' });
      const set = Creator.Block.Base.Set({ expression });
      const data = Creator.Block.Base.SetStepData({ sets: [set] });

      const result = setAdapter.fromDB(data, { context: {} });

      expect(result.sets).eql([
        {
          id,
          variable: set.variable,
          type: BaseNode.Utils.ExpressionTypeV2.ADVANCE,
          expression: '{{[name].name}}',
        },
      ]);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const data = Creator.Block.Base.SetV2NodeData();

      const result = setAdapter.toDB(data, { context: {} });

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

      const result = setAdapter.toDB(data, { context: {} });

      expect(result.sets).eql([
        {
          variable: null,
          expression: '',
        },
      ]);
    });
  });
});
