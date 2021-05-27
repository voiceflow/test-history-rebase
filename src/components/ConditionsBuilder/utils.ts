import { SLOT_REGEXP } from '@voiceflow/common';
import { ConditionsLogicInterface, ExpressionTypeV2 } from '@voiceflow/general-types';
import cuid from 'cuid';
import isEmpty from 'lodash/isEmpty';

import {
  AdvancedExpressionV2,
  EqualsExpressionV2,
  ExpressionData,
  ExpressionV2,
  LogicGroupData,
  ValueExpressionV2,
  VariableExpressionV2,
} from '@/models';

import { LogicUnitDataType } from './types';

// Validations

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
  return (
    (leftValueMissing || rightValueMissing) && !(expression.type === ExpressionTypeV2.IS_EMPTY || expression.type === ExpressionTypeV2.HAS_VALUE)
  );
};

// Default values

export const getAddionalLogicData = (
  expression: ExpressionData | LogicGroupData,
  newCondition: ExpressionV2 | LogicGroupData
): ExpressionData | LogicGroupData => ({
  ...expression,
  type: expression.type || ExpressionTypeV2.AND,
  value: [...expression.value, { ...newCondition }],
});

export const getDefaultValue = (logicInterface: ConditionsLogicInterface): ExpressionV2 | LogicGroupData => {
  switch (logicInterface) {
    case ConditionsLogicInterface.EXPRESSION:
      return {
        id: cuid.slug(),
        logicInterface,
        type: ExpressionTypeV2.ADVANCE,
        value: '',
      } as AdvancedExpressionV2;
    case ConditionsLogicInterface.VARIABLE:
      return {
        id: cuid.slug(),
        logicInterface,
        type: ExpressionTypeV2.EQUALS,
        value: [
          {
            type: ExpressionTypeV2.VARIABLE,
            value: '',
          } as VariableExpressionV2,
          {
            type: ExpressionTypeV2.VALUE,
            value: '',
          } as ValueExpressionV2,
        ],
      } as EqualsExpressionV2;
    case ConditionsLogicInterface.VALUE:
      return {
        id: cuid.slug(),
        logicInterface,
        type: ExpressionTypeV2.EQUALS,
        value: [
          {
            type: ExpressionTypeV2.VALUE,
            value: '',
          } as ValueExpressionV2,
          {
            type: ExpressionTypeV2.VALUE,
            value: '',
          } as ValueExpressionV2,
        ],
      } as EqualsExpressionV2;
    default:
      return {
        id: cuid.slug(),
        logicInterface,
        type: null,
        value: [],
      } as LogicGroupData;
  }
};
