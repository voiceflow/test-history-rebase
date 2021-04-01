import {
  AdvancedExpressionV2,
  AndExpressionV2,
  ExpressionTypeV2,
  ExpressionV2,
  OrExpressionV2,
  ValueExpressionV2,
  VariableExpressionV2,
} from '@voiceflow/general-types';

export type ExpressionDataLogicType = Exclude<
  ExpressionTypeV2,
  ExpressionTypeV2.ADVANCE | ExpressionTypeV2.AND | ExpressionTypeV2.OR | ExpressionTypeV2.VALUE | ExpressionTypeV2.VARIABLE
>;

export type LogicUnitDataType = Exclude<
  ExpressionV2,
  OrExpressionV2 | AndExpressionV2 | VariableExpressionV2 | ValueExpressionV2 | AdvancedExpressionV2
>;

export type DefaultDataType<T> = {
  id: string;
} & T;
