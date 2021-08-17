import { Node } from '@voiceflow/base-types';

export interface GenericExpressionV2<T extends Node.Utils.ExpressionTypeV2, V> {
  id: string;
  type: T | null;
  value: V;
  name?: string;
  logicInterface?: Node.Utils.ConditionsLogicInterface;
}
export type ExpressionTupleV2 = [ExpressionV2?, ExpressionV2?];

export type ValueExpressionV2 = GenericExpressionV2<Node.Utils.ExpressionTypeV2.VALUE, string>;
export type AdvancedExpressionV2 = GenericExpressionV2<Node.Utils.ExpressionTypeV2.ADVANCE, string>;
export type VariableExpressionV2 = GenericExpressionV2<Node.Utils.ExpressionTypeV2.VARIABLE, string>;
export type OrExpressionV2 = GenericExpressionV2<Node.Utils.ExpressionTypeV2.OR, ExpressionTupleV2>;
export type AndExpressionV2 = GenericExpressionV2<Node.Utils.ExpressionTypeV2.AND, ExpressionTupleV2>;
export type LessExpressionV2 = GenericExpressionV2<Node.Utils.ExpressionTypeV2.LESS, ExpressionTupleV2>;
export type EqualsExpressionV2 = GenericExpressionV2<Node.Utils.ExpressionTypeV2.EQUALS, ExpressionTupleV2>;
export type GreaterExpressionV2 = GenericExpressionV2<Node.Utils.ExpressionTypeV2.GREATER, ExpressionTupleV2>;
export type IsEmptyExpression = GenericExpressionV2<Node.Utils.ExpressionTypeV2.IS_EMPTY, ExpressionTupleV2>;
export type ContainsExpression = GenericExpressionV2<Node.Utils.ExpressionTypeV2.CONTAINS, ExpressionTupleV2>;
export type NotEqualExpression = GenericExpressionV2<Node.Utils.ExpressionTypeV2.NOT_EQUAL, ExpressionTupleV2>;
export type EndsWithExpression = GenericExpressionV2<Node.Utils.ExpressionTypeV2.ENDS_WITH, ExpressionTupleV2>;
export type HasValueExpression = GenericExpressionV2<Node.Utils.ExpressionTypeV2.HAS_VALUE, ExpressionTupleV2>;
export type NotContainExpression = GenericExpressionV2<Node.Utils.ExpressionTypeV2.NOT_CONTAIN, ExpressionTupleV2>;
export type StartsWithExpression = GenericExpressionV2<Node.Utils.ExpressionTypeV2.STARTS_WITH, ExpressionTupleV2>;
export type LessOrEqualExpression = GenericExpressionV2<Node.Utils.ExpressionTypeV2.LESS_OR_EQUAL, ExpressionTupleV2>;
export type GreaterOrEqualExpression = GenericExpressionV2<Node.Utils.ExpressionTypeV2.GREATER_OR_EQUAL, ExpressionTupleV2>;
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
export type LogicGroupData = GenericExpressionV2<Node.Utils.ExpressionTypeV2.AND | Node.Utils.ExpressionTypeV2.OR, ExpressionV2[]>;
export type ExpressionData = GenericExpressionV2<Node.Utils.ExpressionTypeV2.AND | Node.Utils.ExpressionTypeV2.OR, (ExpressionV2 | LogicGroupData)[]>;

// older

export interface GenericExpression<T extends Node.Utils.ExpressionType, V> {
  id: string;
  name?: string;
  type: T;
  value: V;
  depth: number;
}

export type ExpressionTuple = [Expression, Expression];

// can't use generic here due tu recursion type issue
export interface NotExpression {
  type: Node.Utils.ExpressionType.NOT;
  value: Expression;
  depth: number;
  id: string;
  name?: string;
}
export type OrExpression = GenericExpression<Node.Utils.ExpressionType.OR, ExpressionTuple>;
export type AndExpression = GenericExpression<Node.Utils.ExpressionType.AND, ExpressionTuple>;
export type LessExpression = GenericExpression<Node.Utils.ExpressionType.LESS, ExpressionTuple>;
export type PlusExpression = GenericExpression<Node.Utils.ExpressionType.PLUS, ExpressionTuple>;
export type MinusExpression = GenericExpression<Node.Utils.ExpressionType.MINUS, ExpressionTuple>;
export type TimesExpression = GenericExpression<Node.Utils.ExpressionType.TIMES, ExpressionTuple>;
export type ValueExpression = GenericExpression<Node.Utils.ExpressionType.VALUE, string>;
export type DivideExpression = GenericExpression<Node.Utils.ExpressionType.DIVIDE, ExpressionTuple>;
export type EqualsExpression = GenericExpression<Node.Utils.ExpressionType.EQUALS, ExpressionTuple>;
export type GreaterExpression = GenericExpression<Node.Utils.ExpressionType.GREATER, ExpressionTuple>;
export type AdvancedExpression = GenericExpression<Node.Utils.ExpressionType.ADVANCE, string>;
export type VariableExpression = GenericExpression<Node.Utils.ExpressionType.VARIABLE, string>;

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
