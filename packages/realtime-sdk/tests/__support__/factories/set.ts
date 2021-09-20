import { Node } from '@voiceflow/base-types';
import { ExpressionType, ExpressionTypeV2 } from '@voiceflow/base-types/build/node/utils';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';

import getRandomEnumElement from '../helpers/getRandomEnumElement';

export const expressionFactory = define<Node.Utils.Expression>({
  depth: () => datatype.number(),
  type: ExpressionType.VARIABLE,
  value: () => lorem.word(),
});

export const setFactory = define<Node.Set.Set>({
  expression: () => expressionFactory(),
  variable: () => lorem.word(),
});

export const setV2Factory = define<NodeData.SetExpressionV2>({
  id: () => datatype.uuid(),
  type: () => getRandomEnumElement(ExpressionTypeV2),
  expression: () => getRandomEnumElement(ExpressionType),
  variable: () => lorem.word(),
});

export const setStepDataFactory = define<Node.Set.StepData>({
  sets: () => [setFactory()],
});

export const setV2NodeDataFactory = define<NodeData.SetV2>({
  sets: () => [setV2Factory()],
});
