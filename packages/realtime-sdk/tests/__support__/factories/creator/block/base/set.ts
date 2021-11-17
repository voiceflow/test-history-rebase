import { getRandomEnumElement } from '@test/utils';
import { Node } from '@voiceflow/base-types';
import { ExpressionType, ExpressionTypeV2 } from '@voiceflow/base-types/build/node/utils';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

export const Expression = define<Node.Utils.Expression>({
  type: (): ExpressionType.VARIABLE => ExpressionType.VARIABLE,
  depth: () => datatype.number(),
  value: () => lorem.word(),
});

export const Set = define<Node.Set.Set>({
  variable: () => lorem.word(),
  expression: () => Expression(),
});

export const SetV2 = define<NodeData.SetExpressionV2>({
  id: () => datatype.uuid(),
  type: () => getRandomEnumElement(ExpressionTypeV2),
  variable: () => lorem.word(),
  expression: () => getRandomEnumElement(ExpressionType),
});

export const SetStepData = define<Node.Set.StepData>({
  sets: () => [Set()],
});

export const SetV2NodeData = define<NodeData.SetV2>({
  sets: () => [SetV2()],
  title: () => lorem.word(),
});
