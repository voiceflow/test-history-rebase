import { SLOT_REGEXP } from '@voiceflow/common';
import { ConditionsLogicInterface, Expression, ExpressionType, ExpressionTypeV2, GenericExpression, ValueExpression } from '@voiceflow/general-types';
import isVarName from 'is-var-name';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import { ExpressionData, ExpressionV2, LogicGroupData } from '@/models';
import { parser as mathJStoJSParser } from '@/utils/mathjsConversion';

const SINGLE_BRACKET_REGEXP = /'/g;

const EXPRESSION_OPERATION_SYMBOL_MAP: Record<string, string> = {
  [ExpressionType.OR]: '||',
  [ExpressionType.AND]: '&&',
  [ExpressionType.PLUS]: '+',
  [ExpressionType.MINUS]: '-',
  [ExpressionType.TIMES]: '*',
  [ExpressionType.DIVIDE]: '/',

  [ExpressionType.EQUALS]: '==',
  [ExpressionType.LESS]: '<',
  [ExpressionType.GREATER]: '>',

  [ExpressionTypeV2.NOT_EQUAL]: '!==',
  [ExpressionTypeV2.GREATER_OR_EQUAL]: '>=',
  [ExpressionTypeV2.LESS_OR_EQUAL]: '<=',
  [ExpressionTypeV2.CONTAINS]: ExpressionTypeV2.CONTAINS,
  [ExpressionTypeV2.NOT_CONTAIN]: 'notContain',
  [ExpressionTypeV2.STARTS_WITH]: '^',
  [ExpressionTypeV2.ENDS_WITH]: '$',
  [ExpressionTypeV2.HAS_VALUE]: '!',
  [ExpressionTypeV2.IS_EMPTY]: 'isEmpty',
};

export const ADVANCE_LOGIC_TYPES = [
  ExpressionType.ADVANCE,
  ExpressionType.NOT,
  ExpressionType.MINUS,
  ExpressionType.DIVIDE,
  ExpressionType.PLUS,
  ExpressionType.TIMES,
];

const expressionfyV2Value = (expression: ValueExpression): string | number => {
  if (!expression.value) {
    return '';
  }

  if (isNumber(expression.value)) {
    return expression.value;
  }

  const strValue = expression.value.toString();
  const strNumberValue = +strValue;

  return Number.isNaN(strNumberValue) ? `'${strValue.replace(SINGLE_BRACKET_REGEXP, "\\'")}'` : strNumberValue;
};

export const expressionfyV2 = (expression: Expression): string | number => {
  if (expression.type === ExpressionType.VALUE) {
    return expressionfyV2Value(expression);
  }

  if (expression.type === ExpressionType.VARIABLE) {
    return isVarName(expression.value) ? `{{[${expression.value}].${expression.value}}}` : 0;
  }

  if (expression.type === ExpressionType.ADVANCE) {
    if (Array.isArray(expression.value)) {
      return mathJStoJSParser(
        expression.value.reduce((acc, curr) => `${acc}${acc ? EXPRESSION_OPERATION_SYMBOL_MAP[expression.type] : ''}${expressionfyV2(curr)}`, '')
      );
    }

    return mathJStoJSParser(expression.value);
  }

  if (expression.type === ExpressionType.NOT) {
    return `!${expressionfyV2(expression.value)}`;
  }

  return `(${expressionfyV2(expression.value[0])} ${EXPRESSION_OPERATION_SYMBOL_MAP[expression.type]} ${expressionfyV2(expression.value[1])})`;
};

/**
 *  gets the list of deepest expressions
 */
export const flatten = (exps: Expression[]): GenericExpression<ExpressionType, string>[] =>
  exps.reduce<GenericExpression<ExpressionType, string>[]>((acc, cur) => {
    const { value } = cur;

    if (Array.isArray(value)) {
      return [...acc, ...flatten(value)];
    }

    if (isString(value)) {
      return [...acc, { ...cur, value }];
    }

    return [...acc, ...flatten([value])];
  }, []);

export const getHighestDepth = (expression: Expression): number => flatten([expression]).reduce((acc, { depth }) => Math.max(acc, depth), 0);

export const isDeepestExpressionAdvance = (expression: Expression): boolean =>
  flatten([expression]).some(({ type }) => ADVANCE_LOGIC_TYPES.includes(type));

export const hasAdvanceChildExpression = (expression: Expression): boolean => {
  if (expression.type === ExpressionType.ADVANCE || expression.type === ExpressionType.NOT) {
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
  [ExpressionTypeV2.OR]: '||',
  [ExpressionTypeV2.AND]: '&&',
  [ExpressionTypeV2.EQUALS]: '==',
  [ExpressionTypeV2.LESS]: '<',
  [ExpressionTypeV2.GREATER]: '>',
  [ExpressionTypeV2.NOT_EQUAL]: '!=',
  [ExpressionTypeV2.GREATER_OR_EQUAL]: '>=',
  [ExpressionTypeV2.LESS_OR_EQUAL]: '<=',
  [ExpressionTypeV2.CONTAINS]: 'contains',
  [ExpressionTypeV2.NOT_CONTAIN]: 'does not contain',
  [ExpressionTypeV2.STARTS_WITH]: 'starts with',
  [ExpressionTypeV2.ENDS_WITH]: 'ends with',
  [ExpressionTypeV2.HAS_VALUE]: 'has value',
  [ExpressionTypeV2.IS_EMPTY]: 'is empty',
};

export const expressionfyLogicUnit = (expression: ExpressionV2): string => {
  if (expression.type === ExpressionTypeV2.VALUE) {
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

  if (expression.type === ExpressionTypeV2.VARIABLE) {
    return `{${expression.value}}`;
  }

  if (expression.type === ExpressionTypeV2.ADVANCE) {
    return expression.value !== '0' ? `${expression.value.replace(SLOT_REGEXP, '{$1}')}` : '';
  }

  return `${expression.value}`;
};

export const expressionfyLogicInterface = (exp: ExpressionV2 | LogicGroupData): string => {
  switch (exp.logicInterface) {
    case ConditionsLogicInterface.VALUE:
    case ConditionsLogicInterface.VARIABLE:
      return (exp.value as Array<ExpressionV2>).reduce((acc: string, curr: ExpressionV2) => {
        acc = `${acc}${acc ? ` ${EXPRESSIONV2_OPERATION_SYMBOL_MAP[exp.type!]} ` : ''}${expressionfyLogicUnit(curr)}`;

        return acc;
      }, '');
    case ConditionsLogicInterface.LOGIC_GROUP:
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
