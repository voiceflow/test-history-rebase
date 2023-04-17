import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { DataConfigurableInterface } from '../constants';
import { BaseLogicType, LogicUnitDataType } from '../types';
import ConditionExpression from './ConditionExpression';
import ConditionLogicGroup from './ConditionLogicGroup';
import LogicUnit from './LogicUnit';

export interface LogicInterfaceHandlerProps {
  firstItem?: boolean;
  expression: Realtime.ExpressionV2 | Realtime.LogicGroupData;
  baseLogicType: BaseLogicType;

  onDelete: () => void;
  onChange: (value: Realtime.ExpressionV2 | Realtime.LogicGroupData) => void;
  updateBaseType: (value: BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR) => void;
}

const LogicInterfaceHandler: React.FC<LogicInterfaceHandlerProps> = ({
  expression,
  onChange,
  onDelete,
  baseLogicType,
  updateBaseType,
  firstItem,
}) => (
  <>
    {expression.logicInterface && DataConfigurableInterface.includes(expression?.logicInterface) && (
      <LogicUnit
        firstItem={firstItem}
        baseLogicType={baseLogicType}
        updateBaseType={updateBaseType}
        expression={expression as LogicUnitDataType}
        onDataChange={onChange}
        onDelete={onDelete}
      />
    )}

    {expression.logicInterface === BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP && (
      <ConditionLogicGroup
        firstItem={firstItem}
        baseLogicType={baseLogicType}
        updateBaseType={updateBaseType}
        expression={expression as Realtime.LogicGroupData}
        onChange={onChange}
        onDelete={onDelete}
      />
    )}

    {expression.logicInterface === BaseNode.Utils.ConditionsLogicInterface.EXPRESSION && (
      <ConditionExpression expression={expression as Realtime.ExpressionV2} onChange={onChange} onDelete={onDelete} />
    )}
  </>
);
export default LogicInterfaceHandler;
