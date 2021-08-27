import { Node } from '@voiceflow/base-types';
import cuid from 'cuid';

import { ExpressionData, ExpressionV2, LogicGroupData } from '../models';
import { transformVariableToString } from '../utils/slot';
import { createAdapter } from './utils';

/**
 * App uses variable format, convert them back into plain string for backend or visa-versa
 * only second value of ExpressionTypeV2.VARIABLE and both values of type ExpressionTypeV2.VALUE are using VariableInput Field
 */
export const convertVariableFormat = createAdapter<Node.Utils.ExpressionV2 | Node.Utils.LogicGroupData, ExpressionV2 | LogicGroupData>(
  (data) => {
    if (data.logicInterface === Node.Utils.ConditionsLogicInterface.VALUE) {
      return {
        ...data,
        value: (data.value as Array<Node.Utils.ExpressionV2 | Node.Utils.LogicGroupData>).map((info) =>
          info.type === Node.Utils.ExpressionTypeV2.VARIABLE ? { ...info, value: `{{[${info.value}].${info.value}}}` } : info
        ),
      } as ExpressionV2;
    }
    if (data.logicInterface === Node.Utils.ConditionsLogicInterface.VARIABLE) {
      return {
        ...data,
        value: (data.value as Array<Node.Utils.ExpressionV2 | Node.Utils.LogicGroupData>).map((info, index) =>
          index === 1 && info.type === Node.Utils.ExpressionTypeV2.VARIABLE ? { ...info, value: `{{[${info.value}].${info.value}}}` } : info
        ),
      } as ExpressionV2;
    }
    return data as ExpressionV2 | LogicGroupData;
  },
  ({ id: _, ...data }) => {
    if (data.logicInterface === Node.Utils.ConditionsLogicInterface.VALUE) {
      return {
        ...data,
        value: (data.value as Array<Node.Utils.ExpressionV2 | Node.Utils.LogicGroupData>).map((info) =>
          info.type === Node.Utils.ExpressionTypeV2.VARIABLE ? { ...info, value: transformVariableToString(info.value) } : info
        ),
      } as Node.Utils.ExpressionV2;
    }
    if (data.logicInterface === Node.Utils.ConditionsLogicInterface.VARIABLE) {
      return {
        ...data,
        value: (data.value as Array<Node.Utils.ExpressionV2 | Node.Utils.LogicGroupData>).map((info, index) =>
          index === 1 && info.type === Node.Utils.ExpressionTypeV2.VARIABLE ? { ...info, value: transformVariableToString(info.value) } : info
        ),
      } as Node.Utils.ExpressionV2;
    }
    return data as Node.Utils.ExpressionV2 | Node.Utils.LogicGroupData;
  }
);

// add ids and change FE friendly format for variables
export const expressionValueAdapter = createAdapter<Node.Utils.ExpressionV2 | Node.Utils.LogicGroupData, ExpressionV2 | LogicGroupData>(
  (condition) => {
    if (condition.logicInterface === Node.Utils.ConditionsLogicInterface.VARIABLE) {
      return { ...convertVariableFormat.fromDB(condition), id: cuid() } as ExpressionV2;
    }
    if (condition.logicInterface === Node.Utils.ConditionsLogicInterface.LOGIC_GROUP) {
      return {
        ...condition,
        value: (condition.value as Array<Node.Utils.ExpressionV2 | Node.Utils.LogicGroupData>).map((data) => ({
          ...convertVariableFormat.fromDB(data),
          id: cuid(),
        })),
      } as LogicGroupData;
    }
    return condition as ExpressionV2;
  },
  (condition) => {
    if (condition.logicInterface === Node.Utils.ConditionsLogicInterface.VARIABLE) {
      return convertVariableFormat.toDB(condition) as Node.Utils.ExpressionV2;
    }
    if (condition.logicInterface === Node.Utils.ConditionsLogicInterface.LOGIC_GROUP) {
      return {
        ...condition,
        value: (condition.value as Array<ExpressionV2 | LogicGroupData>).map((data) => convertVariableFormat.toDB(data)),
      } as Node.Utils.LogicGroupData;
    }
    return condition as Node.Utils.ExpressionV2;
  }
);

// adapter
const expressionAdapterV2 = createAdapter<Node.Utils.ExpressionData, ExpressionData>(
  (expression) =>
    ({
      id: cuid(),
      ...expression,
      value: expressionValueAdapter.mapFromDB(expression.value),
    } as ExpressionData),
  (expression) =>
    ({
      type: expression.type,
      name: expression.name,
      value: expressionValueAdapter.mapToDB(expression.value),
    } as Node.Utils.ExpressionData)
);

export default expressionAdapterV2;
