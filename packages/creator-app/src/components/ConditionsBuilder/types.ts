import { Node } from '@voiceflow/base-types';

import { AdvancedExpressionV2, AndExpressionV2, ExpressionV2, OrExpressionV2, ValueExpressionV2, VariableExpressionV2 } from '@/models';

export type ExpressionDataLogicType = Exclude<
  Node.Utils.ExpressionTypeV2,
  | Node.Utils.ExpressionTypeV2.ADVANCE
  | Node.Utils.ExpressionTypeV2.AND
  | Node.Utils.ExpressionTypeV2.OR
  | Node.Utils.ExpressionTypeV2.VALUE
  | Node.Utils.ExpressionTypeV2.VARIABLE
>;

export type LogicUnitDataType = Exclude<
  ExpressionV2,
  OrExpressionV2 | AndExpressionV2 | VariableExpressionV2 | ValueExpressionV2 | AdvancedExpressionV2
>;

export type BaseLogicType = Node.Utils.ExpressionTypeV2.AND | Node.Utils.ExpressionTypeV2.OR | null;
