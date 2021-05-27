import { ConditionsLogicInterface, ExpressionData, ExpressionTypeV2, ExpressionV2, LogicGroupData } from '@voiceflow/general-types';
import cuid from 'cuid';

import { createAdapter } from '@/client/adapters/utils';
import { ExpressionData as NodeDataExpressionData, ExpressionV2 as NodeDataExpressionV2, LogicGroupData as NodeDataLogicGroupV2 } from '@/models';
import { transformVariableToString } from '@/utils/slot';

/**
 * App uses variable format, convert them back into plain string for backend or visa-versa
 * only second value of ExpressionTypeV2.VARIABLE and both values of type ExpressionTypeV2.VALUE are using VariableInput Field
 */
export const convertVariableFormat = createAdapter<ExpressionV2 | LogicGroupData, NodeDataExpressionV2 | NodeDataLogicGroupV2>(
  (data) => {
    if (data.logicInterface === ConditionsLogicInterface.VALUE) {
      return {
        ...data,
        value: (data.value as Array<ExpressionV2 | LogicGroupData>).map((info) =>
          info.type === ExpressionTypeV2.VARIABLE ? { ...info, value: `{{[${info.value}].${info.value}}}` } : info
        ),
      } as NodeDataExpressionV2;
    }
    if (data.logicInterface === ConditionsLogicInterface.VARIABLE) {
      return {
        ...data,
        value: (data.value as Array<ExpressionV2 | LogicGroupData>).map((info, index) =>
          index === 1 && info.type === ExpressionTypeV2.VARIABLE ? { ...info, value: `{{[${info.value}].${info.value}}}` } : info
        ),
      } as NodeDataExpressionV2;
    }
    return data as NodeDataExpressionV2 | NodeDataLogicGroupV2;
  },
  ({ id: _, ...data }) => {
    if (data.logicInterface === ConditionsLogicInterface.VALUE) {
      return {
        ...data,
        value: (data.value as Array<ExpressionV2 | LogicGroupData>).map((info) =>
          info.type === ExpressionTypeV2.VARIABLE ? { ...info, value: transformVariableToString(info.value) } : info
        ),
      } as ExpressionV2;
    }
    if (data.logicInterface === ConditionsLogicInterface.VARIABLE) {
      return {
        ...data,
        value: (data.value as Array<ExpressionV2 | LogicGroupData>).map((info, index) =>
          index === 1 && info.type === ExpressionTypeV2.VARIABLE ? { ...info, value: transformVariableToString(info.value) } : info
        ),
      } as ExpressionV2;
    }
    return data as ExpressionV2 | LogicGroupData;
  }
);

// add ids and change FE friendly format for variables
export const expressionValueAdapter = createAdapter<ExpressionV2 | LogicGroupData, NodeDataExpressionV2 | NodeDataLogicGroupV2>(
  (condition) => {
    if (condition.logicInterface === ConditionsLogicInterface.VARIABLE) {
      return { ...convertVariableFormat.fromDB(condition), id: cuid() } as NodeDataExpressionV2;
    }
    if (condition.logicInterface === ConditionsLogicInterface.LOGIC_GROUP) {
      return {
        ...condition,
        value: (condition.value as Array<ExpressionV2 | LogicGroupData>).map((data) => ({
          ...convertVariableFormat.fromDB(data),
          id: cuid(),
        })),
      } as NodeDataLogicGroupV2;
    }
    return condition as NodeDataExpressionV2;
  },
  (condition) => {
    if (condition.logicInterface === ConditionsLogicInterface.VARIABLE) {
      return convertVariableFormat.toDB(condition) as ExpressionV2;
    }
    if (condition.logicInterface === ConditionsLogicInterface.LOGIC_GROUP) {
      return {
        ...condition,
        value: (condition.value as Array<NodeDataExpressionV2 | NodeDataLogicGroupV2>).map((data) => convertVariableFormat.toDB(data)),
      } as LogicGroupData;
    }
    return condition as ExpressionV2;
  }
);

// adapter
const expressionAdapterV2 = createAdapter<ExpressionData, NodeDataExpressionData>(
  (expression) =>
    ({
      id: cuid(),
      ...expression,
      value: expressionValueAdapter.mapFromDB(expression.value),
    } as NodeDataExpressionData),
  (expression) =>
    ({
      type: expression.type,
      name: expression.name,
      value: expressionValueAdapter.mapToDB(expression.value),
    } as ExpressionData)
);

export default expressionAdapterV2;
