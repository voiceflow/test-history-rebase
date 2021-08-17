import { Node } from '@voiceflow/base-types';
import { SLOT_REGEXP } from '@voiceflow/common';
import isVarName from 'is-var-name';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import { ExpressionData, ExpressionV2, LogicGroupData } from '@/models';
import { parser as mathJStoJSParser } from '@/utils/mathjsConversion';

const SINGLE_BRACKET_REGEXP = /'/g;
const SINGLE_QUOTES = /^'.*'$/m;

const EXPRESSION_OPERATION_SYMBOL_MAP: Record<string, string> = {
  [Node.Utils.ExpressionType.OR]: '||',
  [Node.Utils.ExpressionType.AND]: '&&',
  [Node.Utils.ExpressionType.PLUS]: '+',
  [Node.Utils.ExpressionType.MINUS]: '-',
  [Node.Utils.ExpressionType.TIMES]: '*',
  [Node.Utils.ExpressionType.DIVIDE]: '/',

  [Node.Utils.ExpressionType.EQUALS]: '==',
  [Node.Utils.ExpressionType.LESS]: '<',
  [Node.Utils.ExpressionType.GREATER]: '>',

  [Node.Utils.ExpressionTypeV2.NOT_EQUAL]: '!==',
  [Node.Utils.ExpressionTypeV2.GREATER_OR_EQUAL]: '>=',
  [Node.Utils.ExpressionTypeV2.LESS_OR_EQUAL]: '<=',
  [Node.Utils.ExpressionTypeV2.CONTAINS]: Node.Utils.ExpressionTypeV2.CONTAINS,
  [Node.Utils.ExpressionTypeV2.NOT_CONTAIN]: 'notContain',
  [Node.Utils.ExpressionTypeV2.STARTS_WITH]: '^',
  [Node.Utils.ExpressionTypeV2.ENDS_WITH]: '$',
  [Node.Utils.ExpressionTypeV2.HAS_VALUE]: '!',
  [Node.Utils.ExpressionTypeV2.IS_EMPTY]: 'isEmpty',
};

export const ADVANCE_LOGIC_TYPES = [
  Node.Utils.ExpressionType.ADVANCE,
  Node.Utils.ExpressionType.NOT,
  Node.Utils.ExpressionType.MINUS,
  Node.Utils.ExpressionType.DIVIDE,
  Node.Utils.ExpressionType.PLUS,
  Node.Utils.ExpressionType.TIMES,
];

const expressionfyV2Value = (expression: Node.Utils.ValueExpression): string | number => {
  if (isNumber(expression.value)) {
    return expression.value;
  }

  const strValue = expression.value.toString();
  const strNumberValue = +strValue;

  return Number.isNaN(strNumberValue) ? `'${strValue.replace(SINGLE_BRACKET_REGEXP, "\\'")}'` : strNumberValue;
};

export const expressionfyV2 = (expression: Node.Utils.Expression): string | number => {
  if (expression.type === Node.Utils.ExpressionType.VALUE) {
    return expressionfyV2Value(expression);
  }

  if (expression.type === Node.Utils.ExpressionType.VARIABLE) {
    return isVarName(expression.value) ? `{{[${expression.value}].${expression.value}}}` : 0;
  }

  if (expression.type === Node.Utils.ExpressionType.ADVANCE) {
    if (Array.isArray(expression.value)) {
      return mathJStoJSParser(
        expression.value.reduce((acc, curr) => `${acc}${acc ? EXPRESSION_OPERATION_SYMBOL_MAP[expression.type] : ''}${expressionfyV2(curr)}`, '')
      );
    }

    return mathJStoJSParser(expression.value);
  }

  if (expression.type === Node.Utils.ExpressionType.NOT) {
    return `!${expressionfyV2(expression.value)}`;
  }

  return `(${expressionfyV2(expression.value[0])} ${EXPRESSION_OPERATION_SYMBOL_MAP[expression.type]} ${expressionfyV2(expression.value[1])})`;
};

/**
 *  gets the list of deepest expressions
 */
export const flatten = (exps: Node.Utils.Expression[]): Node.Utils.GenericExpression<Node.Utils.ExpressionType, string>[] =>
  exps.reduce<Node.Utils.GenericExpression<Node.Utils.ExpressionType, string>[]>((acc, cur) => {
    const { value } = cur;

    if (Array.isArray(value)) {
      return [...acc, ...flatten(value)];
    }

    if (isString(value)) {
      return [...acc, { ...cur, value }];
    }

    return [...acc, ...flatten([value])];
  }, []);

export const getHighestDepth = (expression: Node.Utils.Expression): number =>
  flatten([expression]).reduce((acc, { depth }) => Math.max(acc, depth), 0);

export const isDeepestExpressionAdvance = (expression: Node.Utils.Expression): boolean =>
  flatten([expression]).some(({ type }) => ADVANCE_LOGIC_TYPES.includes(type));

export const hasAdvanceChildExpression = (expression: Node.Utils.Expression): boolean => {
  if (expression.type === Node.Utils.ExpressionType.ADVANCE || expression.type === Node.Utils.ExpressionType.NOT) {
    return true;
  }

  if (
    (Array.isArray(expression.value) && expression.value.some((data: any) => ADVANCE_LOGIC_TYPES.includes(data.type))) ||
    isDeepestExpressionAdvance(expression)
  ) {
    return true;
  }

  return false;
};

/**
 * V2 expression preview formatter
 */

const EXPRESSIONV2_OPERATION_SYMBOL_MAP: Record<string, string> = {
  [Node.Utils.ExpressionTypeV2.OR]: '||',
  [Node.Utils.ExpressionTypeV2.AND]: '&&',
  [Node.Utils.ExpressionTypeV2.EQUALS]: '==',
  [Node.Utils.ExpressionTypeV2.LESS]: '<',
  [Node.Utils.ExpressionTypeV2.GREATER]: '>',
  [Node.Utils.ExpressionTypeV2.NOT_EQUAL]: '!=',
  [Node.Utils.ExpressionTypeV2.GREATER_OR_EQUAL]: '>=',
  [Node.Utils.ExpressionTypeV2.LESS_OR_EQUAL]: '<=',
  [Node.Utils.ExpressionTypeV2.CONTAINS]: 'contains',
  [Node.Utils.ExpressionTypeV2.NOT_CONTAIN]: 'does not contain',
  [Node.Utils.ExpressionTypeV2.STARTS_WITH]: 'starts with',
  [Node.Utils.ExpressionTypeV2.ENDS_WITH]: 'ends with',
  [Node.Utils.ExpressionTypeV2.HAS_VALUE]: 'has value',
  [Node.Utils.ExpressionTypeV2.IS_EMPTY]: 'is empty',
};

export const expressionfyLogicUnit = (expression: ExpressionV2): string => {
  if (expression.type === Node.Utils.ExpressionTypeV2.VALUE) {
    if (!expression.value) {
      return '';
    }

    if (isNumber(expression.value)) {
      return expression.value;
    }

    const strValue = expression.value.toString();
    const strNumberValue = +strValue;

    return Number.isNaN(strNumberValue) ? `'${strValue.replace(SINGLE_BRACKET_REGEXP, "\\'")}'` : strValue;
  }

  if (expression.type === Node.Utils.ExpressionTypeV2.VARIABLE) {
    return `{${expression.value}}`;
  }

  if (expression.type === Node.Utils.ExpressionTypeV2.ADVANCE) {
    if (!expression.value || expression.value === '0') {
      return '';
    }

    return expression.value.replace(SLOT_REGEXP, '{$1}');
  }

  return `${expression.value}`;
};

export const expressionfyLogicInterface = (exp: ExpressionV2 | LogicGroupData): string => {
  switch (exp.logicInterface) {
    case Node.Utils.ConditionsLogicInterface.VALUE:
    case Node.Utils.ConditionsLogicInterface.VARIABLE:
      return (exp.value as Array<ExpressionV2>).reduce((acc: string, curr: ExpressionV2) => {
        acc = `${acc}${acc ? ` ${EXPRESSIONV2_OPERATION_SYMBOL_MAP[exp.type!]} ` : ''}${expressionfyLogicUnit(curr)}`;

        return acc;
      }, '');
    case Node.Utils.ConditionsLogicInterface.LOGIC_GROUP:
      return expressionPreview(exp as LogicGroupData);
    default:
      return expressionfyLogicUnit(exp as ExpressionV2);
  }
};

export const expressionPreview = (expression: ExpressionData | LogicGroupData): string => {
  if (expression.type) {
    return (expression.value as Array<ExpressionV2 | LogicGroupData>).reduce((acc: string, curr: ExpressionV2 | LogicGroupData) => {
      acc = `${acc}${acc ? ` ${EXPRESSIONV2_OPERATION_SYMBOL_MAP[expression.type!]} ` : ''}(${expressionfyLogicInterface(curr)})`;

      return acc;
    }, '');
  }

  return expression.value.length > 0 ? expressionfyLogicInterface(expression?.value[0]) : '';
};

export const sanitizeSetValue = (exp: string, type: Node.Utils.ExpressionTypeV2) => {
  if (exp.match(SINGLE_QUOTES) && type === Node.Utils.ExpressionTypeV2.VALUE) {
    return exp.substring(1, exp.length - 1);
  }
  return exp;
};
