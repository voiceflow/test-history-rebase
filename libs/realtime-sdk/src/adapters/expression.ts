import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter } from 'bidirectional-adapter';

import type { ExpressionData, ExpressionV2, LogicGroupData } from '@/models';
import { transformVariableToString } from '@/utils/slot';

/**
 * App uses variable format, convert them back into plain string for backend or visa-versa
 * only second value of ExpressionTypeV2.VARIABLE and both values of type ExpressionTypeV2.VALUE are using VariableInput Field
 */
export const convertVariableFormat = createMultiAdapter<
  BaseNode.Utils.ExpressionV2 | BaseNode.Utils.LogicGroupData,
  ExpressionV2 | LogicGroupData
>(
  (data) => {
    if (data.logicInterface === BaseNode.Utils.ConditionsLogicInterface.VALUE) {
      return {
        ...data,
        value: (data.value as Array<BaseNode.Utils.ExpressionV2 | BaseNode.Utils.LogicGroupData>).map((info) =>
          info.type === BaseNode.Utils.ExpressionTypeV2.VARIABLE
            ? { ...info, value: `{{[${info.value}].${info.value}}}` }
            : info
        ),
      } as ExpressionV2;
    }
    if (data.logicInterface === BaseNode.Utils.ConditionsLogicInterface.VARIABLE) {
      return {
        ...data,
        value: (data.value as Array<BaseNode.Utils.ExpressionV2 | BaseNode.Utils.LogicGroupData>).map((info, index) =>
          index === 1 && info.type === BaseNode.Utils.ExpressionTypeV2.VARIABLE
            ? { ...info, value: `{{[${info.value}].${info.value}}}` }
            : info
        ),
      } as ExpressionV2;
    }
    return data as ExpressionV2 | LogicGroupData;
  },
  ({ id: _, ...data }) => {
    if (data.logicInterface === BaseNode.Utils.ConditionsLogicInterface.VALUE) {
      return {
        ...data,
        value: (data.value as Array<BaseNode.Utils.ExpressionV2 | BaseNode.Utils.LogicGroupData>).map((info) =>
          info.type === BaseNode.Utils.ExpressionTypeV2.VARIABLE
            ? { ...info, value: transformVariableToString(info.value) }
            : info
        ),
      } as BaseNode.Utils.ExpressionV2;
    }
    if (data.logicInterface === BaseNode.Utils.ConditionsLogicInterface.VARIABLE) {
      return {
        ...data,
        value: (data.value as Array<BaseNode.Utils.ExpressionV2 | BaseNode.Utils.LogicGroupData>).map((info, index) =>
          index === 1 && info.type === BaseNode.Utils.ExpressionTypeV2.VARIABLE
            ? { ...info, value: transformVariableToString(info.value) }
            : info
        ),
      } as BaseNode.Utils.ExpressionV2;
    }
    return data as BaseNode.Utils.ExpressionV2 | BaseNode.Utils.LogicGroupData;
  }
);

// add ids and change FE friendly format for variables
export const expressionValueAdapter = createMultiAdapter<
  BaseNode.Utils.ExpressionV2 | BaseNode.Utils.LogicGroupData,
  ExpressionV2 | LogicGroupData
>(
  (condition) => {
    if (condition.logicInterface === BaseNode.Utils.ConditionsLogicInterface.VARIABLE) {
      return { ...convertVariableFormat.fromDB(condition), id: Utils.id.cuid() } as ExpressionV2;
    }
    if (condition.logicInterface === BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP) {
      return {
        ...condition,
        value: (condition.value as Array<BaseNode.Utils.ExpressionV2 | BaseNode.Utils.LogicGroupData>).map((data) => ({
          ...convertVariableFormat.fromDB(data),
          id: Utils.id.cuid(),
        })),
      } as LogicGroupData;
    }
    return condition as ExpressionV2;
  },
  (condition) => {
    if (condition.logicInterface === BaseNode.Utils.ConditionsLogicInterface.VARIABLE) {
      return convertVariableFormat.toDB(condition) as BaseNode.Utils.ExpressionV2;
    }
    if (condition.logicInterface === BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP) {
      return {
        ...condition,
        value: (condition.value as Array<ExpressionV2 | LogicGroupData>).map((data) =>
          convertVariableFormat.toDB(data)
        ),
      } as BaseNode.Utils.LogicGroupData;
    }
    return condition as BaseNode.Utils.ExpressionV2;
  }
);

// adapter
const expressionAdapterV2 = createMultiAdapter<BaseNode.Utils.ExpressionData, ExpressionData>(
  (expression) =>
    ({
      id: Utils.id.cuid(),
      ...expression,
      value: expressionValueAdapter.mapFromDB(expression.value),
    }) as ExpressionData,
  (expression) =>
    ({
      type: expression.type,
      name: expression.name,
      value: expressionValueAdapter.mapToDB(expression.value),
    }) as BaseNode.Utils.ExpressionData
);

export default expressionAdapterV2;
