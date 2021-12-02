import { getRandomEnumElement } from '@test/utils';
import { Node } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

export const Expression = define<Node.Utils.Expression>({
  type: (): Node.Utils.ExpressionType.VARIABLE => Node.Utils.ExpressionType.VARIABLE,
  depth: () => datatype.number(),
  value: () => lorem.word(),
});

export const Set = define<Node.Set.Set>({
  variable: () => lorem.word(),
  expression: () => Expression(),
});

export const SetV2 = define<NodeData.SetExpressionV2>({
  id: () => datatype.uuid(),
  type: () => getRandomEnumElement(Node.Utils.ExpressionTypeV2),
  variable: () => lorem.word(),
  expression: () => getRandomEnumElement(Node.Utils.ExpressionType),
});

export const SetStepData = define<Node.Set.StepData>({
  sets: () => [Set()],
});

export const SetV2NodeData = define<NodeData.SetV2>({
  sets: () => [SetV2()],
  title: () => lorem.word(),
});
