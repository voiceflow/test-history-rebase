import { ExpressionTypeV2 } from '@voiceflow/general-types';
import React from 'react';

import { FlexAlignStart } from '@/components/Box';
import { ExpressionV2 } from '@/models';

import { BaseLogicType, LogicUnitDataType } from '../types';
import ConditionDataSelect from './ConditionDataSelect';
import ConditionLabel from './ConditionLabel';

export type LogicUnitProps = {
  firstItem?: boolean;
  isLogicGroup?: boolean;
  expression: LogicUnitDataType;
  baseLogicType: BaseLogicType;

  onDelete: () => void;
  onDataChange: (value: ExpressionV2) => void;
  updateBaseType: (value: ExpressionTypeV2.AND | ExpressionTypeV2.OR) => void;
};

const LogicUnit: React.FC<LogicUnitProps> = ({ baseLogicType, updateBaseType, expression, onDataChange, onDelete, firstItem, isLogicGroup }) => {
  const label = firstItem ? 'IF' : baseLogicType?.toUpperCase();

  return (
    <FlexAlignStart mb={16}>
      <ConditionLabel actionable={!firstItem} onChange={updateBaseType}>
        {label}
      </ConditionLabel>
      <ConditionDataSelect isLogicGroup={isLogicGroup} expression={expression} onChange={onDataChange} onDelete={onDelete} />
    </FlexAlignStart>
  );
};

export default LogicUnit;
