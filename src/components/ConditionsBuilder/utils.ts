import { SLOT_REGEXP } from '@voiceflow/common';
import { ConditionsLogicInterface, ExpressionData, ExpressionType, ExpressionV2, LogicGroupData } from '@voiceflow/general-types';
import cuid from 'cuid';
import isEmpty from 'lodash/isEmpty';

import { DefaultDataType, LogicUnitDataType } from './types';

// Validations

// TODO: create an expression validation for Advanced Expression CORE-5503
export const isValidExpression = () => true;

export const isValidExpressionValue = (value: string): boolean => {
  if (!value) return false;

  const variables = value.match(SLOT_REGEXP);

  // VALID: no variables, only alpha-numeric text
  if (!variables) {
    return true;
  }

  // INVALID: multiple variables
  if (variables.length > 1) {
    return false;
  }

  // INVALID: variable and alpha-numeric text
  if (value.length > variables[0].length) {
    return false;
  }

  // VALID: one variable
  return true;
};

export const isVariable = (value: string) => !!value.match(SLOT_REGEXP)?.length;

export const isConditionInvalid = (expression: LogicUnitDataType) => {
  const rightValueMissing = !isEmpty(expression.value[0]?.value) && isEmpty(expression.value[1]?.value);
  const leftValueMissing = !isEmpty(expression.value[1]?.value) && isEmpty(expression.value[0]?.value);

  return leftValueMissing || rightValueMissing;
};

// Default values

export const getAddionalLogicData = (
  expression: ExpressionData | LogicGroupData,
  newCondition: DefaultDataType<ExpressionV2>
): ExpressionData | LogicGroupData => ({
  ...expression,
  type: expression.type || ExpressionType.AND,
  value: [...expression.value, { ...newCondition }],
});

export const getDefaultValue = (logicInterface: ConditionsLogicInterface) => {
  switch (logicInterface) {
    case ConditionsLogicInterface.EXPRESSION:
      return {
        id: cuid.slug(),
        logicInterface,
        type: ExpressionType.ADVANCE,
        value: '',
      };
    case ConditionsLogicInterface.VARIABLE:
      return {
        id: cuid.slug(),
        logicInterface,
        type: ExpressionType.EQUALS,
        value: [
          {
            type: ExpressionType.VARIABLE,
            value: '',
          },
          {
            type: ExpressionType.VALUE,
            value: '',
          },
        ],
      };
    case ConditionsLogicInterface.VALUE:
      return {
        id: cuid.slug(),
        logicInterface,
        type: ExpressionType.EQUALS,
        value: [
          {
            type: ExpressionType.VALUE,
            value: '',
          },
          {
            type: ExpressionType.VALUE,
            value: '',
          },
        ],
      };
    default:
      return {
        id: cuid.slug(),
        logicInterface,
        type: '',
        value: [],
      };
  }
};
