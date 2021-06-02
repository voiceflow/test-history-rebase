import { ConditionsLogicInterface, ExpressionTypeV2 } from '@voiceflow/general-types';
import React from 'react';

import { ExpressionV2, LogicGroupData } from '@/models';

import { DataConfigurableInterface } from '../constants';
import { BaseLogicType, LogicUnitDataType } from '../types';
import ConditionExpression from './ConditionExpression';
import ConditionLogicGroup from './ConditionLogicGroup';
import LogicUnit from './LogicUnit';

export type LogicInterfaceHandlerProps = {
  firstItem?: boolean;
  expression: ExpressionV2 | LogicGroupData;
  baseLogicType: BaseLogicType;

  onDelete: () => void;
  onChange: (value: ExpressionV2 | LogicGroupData) => void;
  updateBaseType: (value: ExpressionTypeV2.AND | ExpressionTypeV2.OR) => void;
};

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

    {expression.logicInterface === ConditionsLogicInterface.LOGIC_GROUP && (
      <ConditionLogicGroup
        firstItem={firstItem}
        baseLogicType={baseLogicType}
        updateBaseType={updateBaseType}
        expression={expression as LogicGroupData}
        onChange={onChange}
        onDelete={onDelete}
      />
    )}

    {expression.logicInterface === ConditionsLogicInterface.EXPRESSION && (
      <ConditionExpression expression={expression as ExpressionV2} onChange={onChange} onDelete={onDelete} />
    )}
  </>
);
export default LogicInterfaceHandler;
