import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

export const Expression = define<BaseNode.Utils.Expression>({
  type: (): BaseNode.Utils.ExpressionType.VARIABLE => BaseNode.Utils.ExpressionType.VARIABLE,
  depth: () => datatype.number(),
  value: () => lorem.word(),
});

export const Set = define<BaseNode.Set.Set>({
  variable: () => lorem.word(),
  expression: () => Expression(),
});

export const SetV2 = define<NodeData.SetExpressionV2>({
  id: () => datatype.uuid(),
  type: () => getRandomEnumElement(BaseNode.Utils.ExpressionTypeV2),
  variable: () => lorem.word(),
  expression: () => getRandomEnumElement(BaseNode.Utils.ExpressionType),
});

export const SetStepData = define<BaseNode.Set.StepData>({
  sets: () => [Set()],
});

export const SetV2NodeData = define<NodeData.SetV2>({
  sets: () => [SetV2()],
  title: () => lorem.word(),
});
