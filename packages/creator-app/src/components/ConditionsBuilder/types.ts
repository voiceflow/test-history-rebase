import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

export type ExpressionDataLogicType = Exclude<
  Node.Utils.ExpressionTypeV2,
  | Node.Utils.ExpressionTypeV2.ADVANCE
  | Node.Utils.ExpressionTypeV2.AND
  | Node.Utils.ExpressionTypeV2.OR
  | Node.Utils.ExpressionTypeV2.VALUE
  | Node.Utils.ExpressionTypeV2.VARIABLE
>;

export type LogicUnitDataType = Exclude<
  Realtime.ExpressionV2,
  Realtime.OrExpressionV2 | Realtime.AndExpressionV2 | Realtime.VariableExpressionV2 | Realtime.ValueExpressionV2 | Realtime.AdvancedExpressionV2
>;

export type BaseLogicType = Node.Utils.ExpressionTypeV2.AND | Node.Utils.ExpressionTypeV2.OR | null;
