import { BaseNode } from '@voiceflow/base-types';
import isVarName from 'is-var-name';
import isNumber from 'lodash/isNumber';
// eslint-disable-next-line you-dont-need-lodash-underscore/is-string
import isString from 'lodash/isString';

import type { ExpressionData, ExpressionV2, LogicGroupData } from '@/models';
import { transformVariablesToReadable } from '@/utils/slot';

import { parser as mathJStoJSParser } from './mathjs';

const SINGLE_BRACKET_REGEXP = /'/g;
const SINGLE_QUOTES = /^'.*'$/m;

const EXPRESSION_OPERATION_SYMBOL_MAP: Record<string, string> = {
  [BaseNode.Utils.ExpressionType.OR]: '||',
  [BaseNode.Utils.ExpressionType.AND]: '&&',
  [BaseNode.Utils.ExpressionType.PLUS]: '+',
  [BaseNode.Utils.ExpressionType.MINUS]: '-',
  [BaseNode.Utils.ExpressionType.TIMES]: '*',
  [BaseNode.Utils.ExpressionType.DIVIDE]: '/',

  [BaseNode.Utils.ExpressionType.EQUALS]: '==',
  [BaseNode.Utils.ExpressionType.LESS]: '<',
  [BaseNode.Utils.ExpressionType.GREATER]: '>',

  [BaseNode.Utils.ExpressionTypeV2.NOT_EQUAL]: '!==',
  [BaseNode.Utils.ExpressionTypeV2.GREATER_OR_EQUAL]: '>=',
  [BaseNode.Utils.ExpressionTypeV2.LESS_OR_EQUAL]: '<=',
  [BaseNode.Utils.ExpressionTypeV2.CONTAINS]: BaseNode.Utils.ExpressionTypeV2.CONTAINS,
  [BaseNode.Utils.ExpressionTypeV2.NOT_CONTAIN]: 'notContain',
  [BaseNode.Utils.ExpressionTypeV2.STARTS_WITH]: '^',
  [BaseNode.Utils.ExpressionTypeV2.ENDS_WITH]: '$',
  [BaseNode.Utils.ExpressionTypeV2.HAS_VALUE]: '!',
  [BaseNode.Utils.ExpressionTypeV2.IS_EMPTY]: 'isEmpty',
};

export const ADVANCE_LOGIC_TYPES = [
  BaseNode.Utils.ExpressionType.ADVANCE,
  BaseNode.Utils.ExpressionType.NOT,
  BaseNode.Utils.ExpressionType.MINUS,
  BaseNode.Utils.ExpressionType.DIVIDE,
  BaseNode.Utils.ExpressionType.PLUS,
  BaseNode.Utils.ExpressionType.TIMES,
];

const expressionfyV2Value = (expression: BaseNode.Utils.ValueExpression): string | number => {
  if (isNumber(expression.value)) {
    return expression.value;
  }

  const strValue = expression.value.toString();
  const strNumberValue = +strValue;

  return Number.isNaN(strNumberValue) ? `'${strValue.replace(SINGLE_BRACKET_REGEXP, "\\'")}'` : strNumberValue;
};

export const expressionfyV2 = (expression: BaseNode.Utils.Expression): string | number => {
  if (expression.type === BaseNode.Utils.ExpressionType.VALUE) {
    return expressionfyV2Value(expression);
  }

  if (expression.type === BaseNode.Utils.ExpressionType.VARIABLE) {
    return isVarName(expression.value) ? `{{[${expression.value}].${expression.value}}}` : 0;
  }

  if (expression.type === BaseNode.Utils.ExpressionType.ADVANCE) {
    if (Array.isArray(expression.value)) {
      return mathJStoJSParser(
        expression.value.reduce(
          (acc, curr) => `${acc}${acc ? EXPRESSION_OPERATION_SYMBOL_MAP[expression.type] : ''}${expressionfyV2(curr)}`,
          ''
        )
      );
    }

    return mathJStoJSParser(expression.value);
  }

  if (expression.type === BaseNode.Utils.ExpressionType.NOT) {
    return `!${expressionfyV2(expression.value)}`;
  }

  return `(${expressionfyV2(expression.value[0])} ${EXPRESSION_OPERATION_SYMBOL_MAP[expression.type]} ${expressionfyV2(expression.value[1])})`;
};

/**
 *  gets the list of deepest expressions
 */
export const flatten = (
  exps: BaseNode.Utils.Expression[]
): BaseNode.Utils.GenericExpression<BaseNode.Utils.ExpressionType, string>[] =>
  exps.reduce<BaseNode.Utils.GenericExpression<BaseNode.Utils.ExpressionType, string>[]>((acc, cur) => {
    const { value } = cur;

    if (Array.isArray(value)) {
      return [...acc, ...flatten(value)];
    }

    if (isString(value)) {
      return [...acc, { ...cur, value }];
    }

    return [...acc, ...flatten([value])];
  }, []);

export const getHighestDepth = (expression: BaseNode.Utils.Expression): number =>
  flatten([expression]).reduce((acc, { depth }) => Math.max(acc, depth), 0);

export const isDeepestExpressionAdvance = (expression: BaseNode.Utils.Expression): boolean =>
  flatten([expression]).some(({ type }) => ADVANCE_LOGIC_TYPES.includes(type));

export const hasAdvanceChildExpression = (expression: BaseNode.Utils.Expression): boolean => {
  if (
    expression.type === BaseNode.Utils.ExpressionType.ADVANCE ||
    expression.type === BaseNode.Utils.ExpressionType.NOT
  ) {
    return true;
  }

  return (
    (Array.isArray(expression.value) &&
      expression.value.some((data: any) => ADVANCE_LOGIC_TYPES.includes(data.type))) ||
    isDeepestExpressionAdvance(expression)
  );
};

/**
 * V2 expression preview formatter
 */

const EXPRESSIONV2_OPERATION_SYMBOL_MAP: Record<string, string> = {
  [BaseNode.Utils.ExpressionTypeV2.OR]: '||',
  [BaseNode.Utils.ExpressionTypeV2.AND]: '&&',
  [BaseNode.Utils.ExpressionTypeV2.EQUALS]: '==',
  [BaseNode.Utils.ExpressionTypeV2.LESS]: '<',
  [BaseNode.Utils.ExpressionTypeV2.GREATER]: '>',
  [BaseNode.Utils.ExpressionTypeV2.NOT_EQUAL]: '!=',
  [BaseNode.Utils.ExpressionTypeV2.GREATER_OR_EQUAL]: '>=',
  [BaseNode.Utils.ExpressionTypeV2.LESS_OR_EQUAL]: '<=',
  [BaseNode.Utils.ExpressionTypeV2.CONTAINS]: 'contains',
  [BaseNode.Utils.ExpressionTypeV2.NOT_CONTAIN]: 'does not contain',
  [BaseNode.Utils.ExpressionTypeV2.STARTS_WITH]: 'starts with',
  [BaseNode.Utils.ExpressionTypeV2.ENDS_WITH]: 'ends with',
  [BaseNode.Utils.ExpressionTypeV2.HAS_VALUE]: 'has value',
  [BaseNode.Utils.ExpressionTypeV2.IS_EMPTY]: 'is empty',
};

export const expressionfyLogicUnit = (
  expression: ExpressionV2,
  variablesMap: Record<string, { id: string; name: string }>
): string => {
  if (expression.type === BaseNode.Utils.ExpressionTypeV2.VALUE) {
    if (!expression.value) {
      return '';
    }

    if (isNumber(expression.value)) {
      return expression.value;
    }

    const strValue = expression.value.toString();
    const strNumberValue = +strValue;

    return Number.isNaN(strNumberValue)
      ? transformVariablesToReadable(`'${strValue.replace(SINGLE_BRACKET_REGEXP, "\\'")}'`, variablesMap)
      : strValue;
  }

  if (expression.type === BaseNode.Utils.ExpressionTypeV2.VARIABLE) {
    return variablesMap[expression.value]?.name ?? transformVariablesToReadable(expression.value, variablesMap);
  }

  if (expression.type === BaseNode.Utils.ExpressionTypeV2.ADVANCE) {
    if (!expression.value || expression.value === '0') {
      return '';
    }

    return transformVariablesToReadable(expression.value, variablesMap);
  }

  return transformVariablesToReadable(`${expression.value}`, variablesMap);
};

export const expressionfyLogicInterface = (
  exp: ExpressionV2 | LogicGroupData,
  variablesMap: Record<string, { id: string; name: string }>
): string => {
  switch (exp.logicInterface) {
    case BaseNode.Utils.ConditionsLogicInterface.VALUE:
    case BaseNode.Utils.ConditionsLogicInterface.VARIABLE:
      return (exp.value as Array<ExpressionV2>).reduce((acc: string, curr: ExpressionV2) => {
        // eslint-disable-next-line no-param-reassign, sonarjs/no-nested-template-literals
        acc = `${acc}${acc ? ` ${EXPRESSIONV2_OPERATION_SYMBOL_MAP[exp.type!]} ` : ''}${expressionfyLogicUnit(curr, variablesMap)}`;

        return acc;
      }, '');
    case BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP:
      return expressionPreview(exp as LogicGroupData, variablesMap);
    default:
      return expressionfyLogicUnit(exp as ExpressionV2, variablesMap);
  }
};

export const expressionPreview = (
  expression: ExpressionData | LogicGroupData,
  variablesMap: Record<string, { id: string; name: string }>
): string => {
  if (expression.type) {
    return (expression.value as Array<ExpressionV2 | LogicGroupData>).reduce(
      (acc: string, curr: ExpressionV2 | LogicGroupData) => {
        // eslint-disable-next-line no-param-reassign, sonarjs/no-nested-template-literals
        acc = `${acc}${acc ? ` ${EXPRESSIONV2_OPERATION_SYMBOL_MAP[expression.type!]} ` : ''}(${expressionfyLogicInterface(curr, variablesMap)})`;

        return acc;
      },
      ''
    );
  }

  return expression.value.length > 0 ? expressionfyLogicInterface(expression?.value[0], variablesMap) : '';
};

export const sanitizeSetValue = (exp: string, type: BaseNode.Utils.ExpressionTypeV2) => {
  if (exp.match(SINGLE_QUOTES) && type === BaseNode.Utils.ExpressionTypeV2.VALUE) {
    return exp.substring(1, exp.length - 1);
  }
  return exp;
};
