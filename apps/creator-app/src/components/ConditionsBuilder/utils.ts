import { BaseNode } from '@voiceflow/base-types';
import { SLOT_REGEXP, Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import isEmpty from 'lodash/isEmpty';

import type { LogicUnitDataType } from './types';

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
    !(
      expression.type === BaseNode.Utils.ExpressionTypeV2.IS_EMPTY ||
      expression.type === BaseNode.Utils.ExpressionTypeV2.HAS_VALUE
    )
  );
};

// Default values

export const getAddionalLogicData = <
  T extends Realtime.ExpressionData | Realtime.LogicGroupData = Realtime.ExpressionData | Realtime.LogicGroupData,
>(
  expression: Realtime.ExpressionData | Realtime.LogicGroupData,
  newCondition: Realtime.ExpressionV2 | Realtime.LogicGroupData
): T =>
  ({
    ...expression,
    type: expression.type || BaseNode.Utils.ExpressionTypeV2.AND,
    value: [...expression.value, { ...newCondition }],
  }) as T;

export const getDefaultValue = (
  logicInterface: BaseNode.Utils.ConditionsLogicInterface,
  isV2?: boolean
): Realtime.ExpressionV2 | Realtime.LogicGroupData => {
  switch (logicInterface) {
    case BaseNode.Utils.ConditionsLogicInterface.EXPRESSION:
      return {
        id: Utils.id.cuid.slug(),
        logicInterface,
        type: BaseNode.Utils.ExpressionTypeV2.ADVANCE,
        value: '',
      } as Realtime.AdvancedExpressionV2;
    case BaseNode.Utils.ConditionsLogicInterface.VARIABLE:
      return {
        id: Utils.id.cuid.slug(),
        logicInterface,
        type: BaseNode.Utils.ExpressionTypeV2.EQUALS,
        value: [
          {
            type: BaseNode.Utils.ExpressionTypeV2.VARIABLE,
            value: '',
          } as Realtime.VariableExpressionV2,
          {
            type: BaseNode.Utils.ExpressionTypeV2.VALUE,
            value: '',
          } as Realtime.ValueExpressionV2,
        ],
      } as Realtime.EqualsExpressionV2;
    case BaseNode.Utils.ConditionsLogicInterface.VALUE:
      return {
        id: Utils.id.cuid.slug(),
        logicInterface,
        type: BaseNode.Utils.ExpressionTypeV2.EQUALS,
        value: [
          {
            type: BaseNode.Utils.ExpressionTypeV2.VALUE,
            value: '',
          } as Realtime.ValueExpressionV2,
          {
            type: BaseNode.Utils.ExpressionTypeV2.VALUE,
            value: '',
          } as Realtime.ValueExpressionV2,
        ],
      } as Realtime.EqualsExpressionV2;
    default:
      return {
        id: Utils.id.cuid.slug(),
        logicInterface,
        type: null,
        value: isV2
          ? [
              getDefaultValue(BaseNode.Utils.ConditionsLogicInterface.VARIABLE),
              getDefaultValue(BaseNode.Utils.ConditionsLogicInterface.VARIABLE),
            ]
          : [],
      } as Realtime.LogicGroupData;
  }
};
