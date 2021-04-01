import { ConditionsLogicInterface, ExpressionData, ExpressionType, ExpressionV2, LogicGroupData } from '@voiceflow/general-types';
import cuid from 'cuid';
import isEmpty from 'lodash/isEmpty';

import { DefaultDataType, LogicUnitDataType } from './types';

// Validations

// TODO: create an expression validation for Advanced Expression CORE-5503
export const isValidExpression = () => true;

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
