import { BaseNode } from '@voiceflow/base-types';

export interface GenericExpressionV2<T extends BaseNode.Utils.ExpressionTypeV2, V> {
  id: string;
  type: T | null;
  value: V;
  name?: string;
  logicInterface?: BaseNode.Utils.ConditionsLogicInterface;
}
export type ExpressionTupleV2 = [ExpressionV2?, ExpressionV2?];

export type ValueExpressionV2 = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.VALUE, string>;
export type AdvancedExpressionV2 = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.ADVANCE, string>;
export type VariableExpressionV2 = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.VARIABLE, string>;
export type OrExpressionV2 = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.OR, ExpressionTupleV2>;
export type AndExpressionV2 = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.AND, ExpressionTupleV2>;
export type LessExpressionV2 = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.LESS, ExpressionTupleV2>;
export type EqualsExpressionV2 = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.EQUALS, ExpressionTupleV2>;
export type GreaterExpressionV2 = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.GREATER, ExpressionTupleV2>;
export type IsEmptyExpression = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.IS_EMPTY, ExpressionTupleV2>;
export type ContainsExpression = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.CONTAINS, ExpressionTupleV2>;
export type NotEqualExpression = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.NOT_EQUAL, ExpressionTupleV2>;
export type EndsWithExpression = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.ENDS_WITH, ExpressionTupleV2>;
export type HasValueExpression = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.HAS_VALUE, ExpressionTupleV2>;
export type NotContainExpression = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.NOT_CONTAIN, ExpressionTupleV2>;
export type StartsWithExpression = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.STARTS_WITH, ExpressionTupleV2>;
export type LessOrEqualExpression = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.LESS_OR_EQUAL, ExpressionTupleV2>;
export type GreaterOrEqualExpression = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.GREATER_OR_EQUAL, ExpressionTupleV2>;
export type ExpressionV2 =
  | OrExpressionV2
  | AndExpressionV2
  | LessExpressionV2
  | ValueExpressionV2
  | EqualsExpressionV2
  | GreaterExpressionV2
  | VariableExpressionV2
  | AdvancedExpressionV2
  | IsEmptyExpression
  | NotEqualExpression
  | ContainsExpression
  | EndsWithExpression
  | HasValueExpression
  | NotContainExpression
  | StartsWithExpression
  | LessOrEqualExpression
  | GreaterOrEqualExpression;

export type LogicGroupData = GenericExpressionV2<BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR, ExpressionV2[]>;
export type ExpressionData = GenericExpressionV2<
  BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR,
  (ExpressionV2 | LogicGroupData)[]
>;

export type TuppleExpression =
  | OrExpressionV2
  | AndExpressionV2
  | LessExpressionV2
  | EqualsExpressionV2
  | GreaterExpressionV2
  | IsEmptyExpression
  | ContainsExpression
  | NotEqualExpression
  | EndsWithExpression
  | HasValueExpression
  | NotContainExpression
  | StartsWithExpression
  | LessOrEqualExpression
  | GreaterOrEqualExpression;

// older

export interface GenericExpression<T extends BaseNode.Utils.ExpressionType, V> {
  id: string;
  name?: string;
  type: T;
  value: V;
  depth: number;
}

export type ExpressionTuple = [Expression, Expression];

// can't use generic here due tu recursion type issue
export interface NotExpression {
  type: BaseNode.Utils.ExpressionType.NOT;
  value: Expression;
  depth: number;
  id: string;
  name?: string;
}
export type OrExpression = GenericExpression<BaseNode.Utils.ExpressionType.OR, ExpressionTuple>;
export type AndExpression = GenericExpression<BaseNode.Utils.ExpressionType.AND, ExpressionTuple>;
export type LessExpression = GenericExpression<BaseNode.Utils.ExpressionType.LESS, ExpressionTuple>;
export type PlusExpression = GenericExpression<BaseNode.Utils.ExpressionType.PLUS, ExpressionTuple>;
export type MinusExpression = GenericExpression<BaseNode.Utils.ExpressionType.MINUS, ExpressionTuple>;
export type TimesExpression = GenericExpression<BaseNode.Utils.ExpressionType.TIMES, ExpressionTuple>;
export type ValueExpression = GenericExpression<BaseNode.Utils.ExpressionType.VALUE, string>;
export type DivideExpression = GenericExpression<BaseNode.Utils.ExpressionType.DIVIDE, ExpressionTuple>;
export type EqualsExpression = GenericExpression<BaseNode.Utils.ExpressionType.EQUALS, ExpressionTuple>;
export type GreaterExpression = GenericExpression<BaseNode.Utils.ExpressionType.GREATER, ExpressionTuple>;
export type AdvancedExpression = GenericExpression<BaseNode.Utils.ExpressionType.ADVANCE, string>;
export type VariableExpression = GenericExpression<BaseNode.Utils.ExpressionType.VARIABLE, string>;

export type Expression =
  | NotExpression
  | OrExpression
  | AndExpression
  | LessExpression
  | PlusExpression
  | MinusExpression
  | TimesExpression
  | ValueExpression
  | DivideExpression
  | EqualsExpression
  | GreaterExpression
  | AdvancedExpression
  | VariableExpression;
