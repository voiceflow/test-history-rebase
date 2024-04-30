import { faker } from '@faker-js/faker';
import { getRandomEnumElement } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';

import type { NodeData } from '@/models';

export const Expression = define<BaseNode.Utils.Expression>({
  type: (): BaseNode.Utils.ExpressionType.VARIABLE => BaseNode.Utils.ExpressionType.VARIABLE,
  depth: () => faker.datatype.number(),
  value: () => faker.lorem.word(),
});

export const Set = define<BaseNode.Set.Set>({
  variable: () => faker.lorem.word(),
  expression: () => Expression(),
});

export const SetV2 = define<NodeData.SetExpressionV2>({
  id: () => faker.datatype.uuid(),
  type: () => getRandomEnumElement(BaseNode.Utils.ExpressionTypeV2),
  variable: () => faker.lorem.word(),
  expression: () => getRandomEnumElement(BaseNode.Utils.ExpressionType),
});

export const SetStepData = define<BaseNode.Set.StepData>({
  sets: () => [Set()],
});

export const SetV2NodeData = define<NodeData.SetV2>({
  sets: () => [SetV2()],
  title: () => faker.lorem.word(),
});
