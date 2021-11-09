import { Node } from '@voiceflow/base-types';
import { SLOT_REGEXP, Utils } from '@voiceflow/common';
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
    (leftValueMissing || rightValueMissing) &&
    !(expression.type === Node.Utils.ExpressionTypeV2.IS_EMPTY || expression.type === Node.Utils.ExpressionTypeV2.HAS_VALUE)
  );
};

// Default values

export const getAddionalLogicData = (
  expression: ExpressionData | LogicGroupData,
  newCondition: ExpressionV2 | LogicGroupData
): ExpressionData | LogicGroupData => ({
  ...expression,
  type: expression.type || Node.Utils.ExpressionTypeV2.AND,
  value: [...expression.value, { ...newCondition }],
});

export const getDefaultValue = (logicInterface: Node.Utils.ConditionsLogicInterface): ExpressionV2 | LogicGroupData => {
  switch (logicInterface) {
    case Node.Utils.ConditionsLogicInterface.EXPRESSION:
      return {
        id: Utils.id.cuid.slug(),
        logicInterface,
        type: Node.Utils.ExpressionTypeV2.ADVANCE,
        value: '',
      } as AdvancedExpressionV2;
    case Node.Utils.ConditionsLogicInterface.VARIABLE:
      return {
        id: Utils.id.cuid.slug(),
        logicInterface,
        type: Node.Utils.ExpressionTypeV2.EQUALS,
        value: [
          {
            type: Node.Utils.ExpressionTypeV2.VARIABLE,
            value: '',
          } as VariableExpressionV2,
          {
            type: Node.Utils.ExpressionTypeV2.VALUE,
            value: '',
          } as ValueExpressionV2,
        ],
      } as EqualsExpressionV2;
    case Node.Utils.ConditionsLogicInterface.VALUE:
      return {
        id: Utils.id.cuid.slug(),
        logicInterface,
        type: Node.Utils.ExpressionTypeV2.EQUALS,
        value: [
          {
            type: Node.Utils.ExpressionTypeV2.VALUE,
            value: '',
          } as ValueExpressionV2,
          {
            type: Node.Utils.ExpressionTypeV2.VALUE,
            value: '',
          } as ValueExpressionV2,
        ],
      } as EqualsExpressionV2;
    default:
      return {
        id: Utils.id.cuid.slug(),
        logicInterface,
        type: null,
        value: [],
      } as LogicGroupData;
  }
};
