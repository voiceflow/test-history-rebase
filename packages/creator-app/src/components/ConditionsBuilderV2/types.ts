import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

export type ExpressionDataLogicType = Exclude<
  BaseNode.Utils.ExpressionTypeV2,
  | BaseNode.Utils.ExpressionTypeV2.ADVANCE
  | BaseNode.Utils.ExpressionTypeV2.AND
  | BaseNode.Utils.ExpressionTypeV2.OR
  | BaseNode.Utils.ExpressionTypeV2.VALUE
  | BaseNode.Utils.ExpressionTypeV2.VARIABLE
>;

export type LogicUnitDataType = Exclude<
  Realtime.ExpressionV2,
  Realtime.OrExpressionV2 | Realtime.AndExpressionV2 | Realtime.VariableExpressionV2 | Realtime.ValueExpressionV2 | Realtime.AdvancedExpressionV2
>;

export type BaseLogicType = BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR | null;
